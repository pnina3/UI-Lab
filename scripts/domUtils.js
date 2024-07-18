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
// Function to create HTML table
export function createTable(level1_arr, level2_arr) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create the header row
  const headerRow = document.createElement('tr');
  level1_arr.forEach((headerText) => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  thead.appendChild(headerRow);

  // Create the body rows
  const numRows = level2_arr[0].length; // assuming each sub-array is the same length
  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('tr');
    level2_arr.forEach((columnData) => {
      const cell = document.createElement('td');
      cell.textContent = columnData[i];
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  }

  // Append thead and tbody to table
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}
