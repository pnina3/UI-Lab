import { level1_arr, level2_arr, operator } from './arrayData.js';
import {
  createSelectList,
  appendToFieldsContainer,
  populateSelectList,
  updateOrCreateTable, // updated import to reflect new function name
} from './domUtils.js';
import { initializeEventListeners } from './eventListeners.js';

// Define necessary variables
let actionStatus = 'new';
const tagsArray = [];
const filterArray = [];

const mainContainer = document.getElementById('main-container');
const fieldsContainer = document.getElementById('fields-container'); // Ensure correct spelling if it's different in HTML
const addButton = document.querySelector('.add_tag');
const clearAllButton = document.getElementById('clear_all');
const submitButton = document.createElement('button');
const table = document.getElementById('data-table'); // Ensure this exists in your HTML or create it

submitButton.classList.add('submit');
submitButton.textContent = 'Submit';

const level1Container = createSelectList('field-container');
const operatorContainer = createSelectList('operator-container');
const level2Container = createSelectList('value-container');

appendToFieldsContainer(fieldsContainer, level1Container);
appendToFieldsContainer(fieldsContainer, operatorContainer);
appendToFieldsContainer(fieldsContainer, level2Container);
appendToFieldsContainer(fieldsContainer, submitButton);

populateSelectList(level1Container, level1_arr);
populateSelectList(operatorContainer, operator);

// Initial table creation
if (!table) {
  // If no table exists, create it and append it
  let table = document.createElement('table');
  table.setAttribute('id', 'data-table');
  mainContainer.appendChild(table);
}
updateOrCreateTable(table, level1_arr, level2_arr, actionStatus); // Use this function to manage table updates

initializeEventListeners(
  mainContainer,
  fieldsContainer,
  level1Container,
  operatorContainer,
  level2Container,
  addButton,
  clearAllButton,
  submitButton,
  table,
  filterArray,
  tagsArray,
  {
    actionStatus,
  }
);
