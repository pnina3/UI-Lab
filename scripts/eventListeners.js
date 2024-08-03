// eventListeners.js
import { level1_arr, level2_arr, operator } from './arrayData.js';
import {
  createSelectList,
  appendToFieldsContainer,
  populateSelectList,
  clearSelectList,
  createTag,
  updateOrCreateTable,
} from './domUtils.js';

export function initializeEventListeners(
  mainContainer,
  fieldsContainer,
  level1Container,
  operatorContainer,
  level2Container,
  addButton,
  clearAllButton,
  submitButton,
  table,
  tableHeader,
  filterArray,
  tagsArray,
  variables
) {
  let {
    actionStatus,
    fieldData,
    valueData,
    operatorData,
    currentIndex,
    selectedTag,
    generatedID = 0,
  } = variables;

  //nwe comment

  // Assuming you have a div with id 'table-container' in your HTML to append the table
  // document
  //   .getElementById('table-container')
  //   .appendChild(createTable(level1_arr, level2_arr));

  level1Container.addEventListener('change', function (e) {
    e.preventDefault();
    clearSelectList(level2Container);

    const index = level1Container.selectedIndex;
    fieldData = e.target.value;

    if (index > 0) {
      populateSelectList(level2Container, level2_arr[index - 1]);
    }
  });

  operatorContainer.addEventListener('change', function (e) {
    operatorData = e.target.value;
  });

  level2Container.addEventListener('change', function (e) {
    valueData = e.target.value;
  });

  //REMOVE TAG
  mainContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('close')) {
      const parentTag = e.target.parentElement;
      const dataDiv = parentTag.querySelector('div[data-id]'); // Select the div containing the data
      if (dataDiv) {
        tagsArray.forEach(function (item) {
          if (item.id == dataDiv.dataset.id) {
            fieldData = item.field;
            valueData = item.value;
            operatorData = item.operator;
            manageFilters(
              fieldData,
              operatorData,
              valueData,
              filterArray,
              table,
              'delete'
            );
          }
        });
      }

      parentTag.remove();
    }
  });

  //REMOVE ALL
  clearAllButton.addEventListener('click', function () {
    const tagWrappers = document.querySelectorAll('.tag_wrapper');
    tagWrappers.forEach(function (tag) {
      tag.remove();
    });
    tagsArray.length = []; //clear all items from the tags arry
    showCleraAll('remove');
  });

  //ADD
  addButton.addEventListener('click', function (e) {
    actionStatus = 'new';
    if (fieldsContainer.classList.contains('hidden')) {
      fieldsContainer.classList.remove('hidden');
    }
    clearFields(level1Container, level2Container, operatorContainer);
    calcFieldsContainerPosition('new', fieldsContainer, tagsArray);
  });

  //SUBMIT
  submitButton.addEventListener('click', function (e) {
    if (actionStatus === 'new') {
      generatedID++;
      assignTagValues(
        mainContainer,
        addButton,
        tagsArray,
        generatedID,
        fieldData,
        operatorData,
        valueData
      );

      calcFieldsContainerPosition('new', fieldsContainer, tagsArray);
    } else {
      updateTags(
        selectedTag,
        currentIndex,
        fieldData,
        operatorData,
        valueData,
        tagsArray
      );
    }
    clearFields(level1Container, level2Container, operatorContainer);
    clearSelectList(level2Container);
    manageFilters(
      fieldData,
      operatorData,
      valueData,
      filterArray,
      table,
      'add'
    );
  });

  //EDIT
  mainContainer.addEventListener('click', function (e) {
    const tagWrapper = e.target.closest('.tag_wrapper');

    // if user clicked on the tag
    if (tagWrapper && !e.target.classList.contains('close')) {
      tagsArray.forEach(function (item, index) {
        if (item.id == tagWrapper.firstChild.dataset.id) {
          actionStatus = 'edit';
          currentIndex = index;
          selectedTag = tagWrapper;

          //clear level 2 fields
          assignSelectedValues(
            item,
            level1Container,
            operatorContainer,
            level2Container
          );

          //show tags container
          fieldsContainer.classList.remove('hidden');
          calcFieldsContainerPosition('edit', fieldsContainer, selectedTag);
        }
      });
    }
  });

  tableHeader.addEventListener('click', function (e) {
    const target = e.target.closest('th');
    const icon = target.querySelector('i');
    const sortState = icon.className;
    switch (sortState) {
      case 'fa-solid fa-sort':
        icon.classList.remove('fa-sort');
        icon.classList.add('fa-sort-up');
        break;
      case 'fa-solid fa-sort-up':
        icon.classList.remove('fa-sort-up');
        icon.classList.add('fa-sort-down');
        break;
      case 'fa-solid fa-sort-down':
        icon.classList.remove('fa-sort-down');
        icon.classList.add('fa-sort');
        break;
    }
    sortTable(target.id);
  });

  //REMOVE TAG BOX when clicking on the document
  document.addEventListener('click', function (event) {
    if (
      !fieldsContainer.contains(event.target) &&
      !addButton.contains(event.target) &&
      !event.target.closest('.tag_wrapper')
    ) {
      fieldsContainer.classList.add('hidden');
    }
  });
}

function calcFieldsContainerPosition(action, fieldsContainer, selectedTag) {
  const tags = document.querySelectorAll('.tag_wrapper');
  if (action === 'new') {
    if (tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      const lastTagRight = lastTag.offsetLeft + lastTag.offsetWidth;
      fieldsContainer.style.left = lastTagRight + 'px';
    } else {
      fieldsContainer.style.left = 0 + 'px';
    }
  } else {
    const edtPos = selectedTag.getBoundingClientRect().left + 'px';
    fieldsContainer.style.left = edtPos;
  }
}

function clearFields(level1Container, level2Container, operatorContainer) {
  level1Container.selectedIndex = 0;
  level2Container.selectedIndex = 0;
  operatorContainer.selectedIndex = 0;
}

function assignTagValues(
  mainContainer,
  addButton,
  tagsArray,
  generatedID,
  fieldData,
  operatorData,
  valueData
) {
  const tagObject = {
    id: generatedID,
    field: fieldData,
    operator: operatorData,
    value: valueData,
  };
  tagsArray.push(tagObject);

  createTags(tagObject, mainContainer, addButton);
  if (tagsArray.length == 1) {
    showCleraAll('add');
  }
}

function createTags(tagObject, mainContainer, addButton) {
  const tagText = `${tagObject.field} ${tagObject.operator} ${tagObject.value}`;
  const tag = createTag(tagText, tagObject.id);
  mainContainer.appendChild(tag);
  mainContainer.insertBefore(tag, addButton);
}

function updateTags(
  selectedTag,
  currentIndex,
  fieldData,
  operatorData,
  valueData,
  tagsArray
) {
  selectedTag.firstChild.textContent = `${fieldData} ${operatorData} ${valueData}`;
  tagsArray[currentIndex].field = fieldData;
  tagsArray[currentIndex].operator = operatorData;
  tagsArray[currentIndex].value = valueData;
}

function showCleraAll(action) {
  const clearAllButton = document.getElementById('clear_all');
  if (action == 'add') {
    clearAllButton.classList.remove('hidden'); //show
  } else {
    clearAllButton.classList.add('hidden'); //show
  }
}

function assignSelectedValues(
  item,
  level1Container,
  operatorContainer,
  level2Container
) {
  clearSelectList(level2Container);

  const select_arrs = [
    { select: level1Container, value: item.field },
    { select: operatorContainer, value: item.operator },
    { select: level2Container, value: item.value },
  ];

  //populate level 2
  level1_arr.forEach(function (level1_item, index) {
    if (level1_item == item.field) {
      populateSelectList(level2Container, level2_arr[index]);
    }
  });

  select_arrs.forEach(function (obj) {
    const selectElement = obj.select;
    const selectValue = obj.value;

    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].text === selectValue) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  });
}

function manageFilters(
  fieldData,
  operatorData,
  valueData,
  filterArray,
  table,
  action
) {
  const fieldIndex = level1_arr.indexOf(fieldData);

  if (fieldIndex !== -1) {
    if (action === 'add') {
      level2_arr[fieldIndex].forEach((item, level2Index) => {
        // Apply filter based on operator
        let conditionMet = false;
        switch (operatorData) {
          case '=':
            conditionMet = item === valueData;
            break;
          case '<>':
            conditionMet = item !== valueData;
            break;
        }

        if (conditionMet) {
          // Adding filtered data to an array
          level2_arr.forEach(function (item, index) {
            if (!filterArray[index]) {
              filterArray[index] = [];
            }
            filterArray[index].push(item[level2Index]);
          });
        }
      });
      filterArray = removeDuplicates(filterArray); // Remove duplicates after adding new items
    } else if (action === 'delete') {
      filterArray = removeDuplicates(filterArray);
      // Iterate over filterArray and remove elements based on the condition
      // the iteration is done in reverse to prevent resafeling of the array order which is performed with the splice method
      for (
        let level2_index = filterArray[fieldIndex].length - 1;
        level2_index >= 0;
        level2_index--
      ) {
        let subArray = filterArray[fieldIndex][level2_index];
        // Apply filter based on operator
        let conditionMet = false;
        switch (operatorData) {
          case '=':
            conditionMet = subArray === valueData;
            break;
          case '<>':
            conditionMet = subArray !== valueData;
            break;
        }
        if (conditionMet) {
          filterArray.forEach(function (item) {
            item.splice(level2_index, 1);
          });
        }
      }
    }

    if (filterArray.length > 0) {
      updateOrCreateTable(table, level1_arr, filterArray, 'filter');
    } else {
      updateOrCreateTable(table, level1_arr, level2_arr, 'new');
    }

    // if (
    //   filterArray.length > 0 &&
    //   filterArray.some((subArray) => subArray.length > 0)
    // ) {
    //   updateOrCreateTable(table, level1_arr, filterArray, 'filter');
    // } else {
    //   updateOrCreateTable(table, level1_arr, level2_arr, 'new');
    // }
  }
}
//test comment 123
function removeDuplicates(filterArray) {
  const uniqueSet = new Set();
  //create new empty multidimentional array
  const newFilterArray = Array(filterArray.length)
    .fill()
    .map(() => []);

  // Assuming all columns in filterArray have the same length
  for (let i = 0; i < filterArray[0].length; i++) {
    const row = filterArray.map((column) => column[i]);
    const serializedRow = JSON.stringify(row);

    if (!uniqueSet.has(serializedRow)) {
      uniqueSet.add(serializedRow);
      row.forEach((item, index) => {
        newFilterArray[index].push(item);
      });
    }
  }

  return newFilterArray;
}
function sortTable(id) {
  console.log(id);
  let sortedCol = level2_arr[id].sort();
  console.log(sortedCol);
}
