// eventListeners.js
import { level1_arr, level2_arr, operator } from './arrayData.js';
import {
  createSelectList,
  appendToFieldsContainer,
  populateSelectList,
  clearSelectList,
  createTag,
  createTable,
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
    generatedID,
  } = variables;

  // Assuming you have a div with id 'table-container' in your HTML to append the table
  document
    .getElementById('table-container')
    .appendChild(createTable(level1_arr, level2_arr));

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
      assignTagValues(
        mainContainer,
        addButton,
        tagsArray,
        generatedID,
        fieldData,
        operatorData,
        valueData
      );
      generatedID++;
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
  });

  //EDIT
  mainContainer.addEventListener('click', function (e) {
    console.log(level2Container);
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
