// domUtils.js
export function createSelectList(id) {
  const select_list = document.createElement('select');
  select_list.setAttribute('id', id);
  return select_list;
}

export function appendToFieldsContainer(container, element) {
  return container.appendChild(element);
}

export function populateSelectList(selectElement, options) {
  const defaultOption = document.createElement('option');
  defaultOption.text = 'select';
  selectElement.appendChild(defaultOption);

  options.forEach((item) => {
    const option = document.createElement('option');
    option.text = item;
    selectElement.appendChild(option);
  });
}

export function clearSelectList(selectElement) {
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
}

export function createTag(tagText, tagId) {
  const tagWrapper = document.createElement('div');
  tagWrapper.classList.add('tag_wrapper');

  const tagData = document.createElement('div');
  tagData.textContent = tagText;
  tagData.dataset.id = tagId;

  const tagClose = document.createElement('div');
  tagClose.setAttribute('class', 'close');

  tagWrapper.appendChild(tagData);
  tagWrapper.appendChild(tagClose);

  return tagWrapper;
}
// Function to update or create a table based on provided arrays
export function updateOrCreateTable(table, level1_arr, level2_arr, action) {
  // Find or create thead and tbody
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    table.appendChild(thead);
  }

  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  } else if (action === 'filter') {
    // Clear existing rows if filtering
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  // Create the header row if it's empty
  if (thead.rows.length === 0) {
    const headerRow = document.createElement('tr');
    level1_arr.forEach((headerText) => {
      const header = document.createElement('th');
      header.textContent = headerText;
      headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
  }

  // Create the body rows
  level2_arr[0].forEach((_, index) => {
    const row = document.createElement('tr');
    level2_arr.forEach((columnData) => {
      const cell = document.createElement('td');
      cell.textContent = columnData[index];
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  return table;
}
