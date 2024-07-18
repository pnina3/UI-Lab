// main.js
import { level1_arr, level2_arr, operator } from './arrayData.js';
import {
  createSelectList,
  appendToFieldsContainer,
  populateSelectList,
  createTable,
} from './domUtils.js';
import { initializeEventListeners } from './eventListeners.js';

// Define necessary variables
let actionStatus = 'new';
let fieldData;
let valueData;
let operatorData;
let currentIndex = -1;
let selectedTag;
let generatedID = 1;
const tagsArray = [];

const mainContainer = document.getElementById('main-container');
const fieldsContainer = document.getElementById('fileds-container');
const addButton = document.querySelector('.add_tag');
const clearAllButton = document.getElementById('clear_all');
const submitButton = document.createElement('button');
const table = document.getElementById('data-table');
const thead = document.getElementById('table-head');
const tbody = document.getElementById('table-body');

submitButton.classList.add('submit');
submitButton.textContent = 'submit';

const level1Container = createSelectList('field-container');
const operatorContainer = createSelectList('operator-container');
const level2Container = createSelectList('value-container');

appendToFieldsContainer(fieldsContainer, level1Container);
appendToFieldsContainer(fieldsContainer, operatorContainer);
appendToFieldsContainer(fieldsContainer, level2Container);
appendToFieldsContainer(fieldsContainer, submitButton);

populateSelectList(level1Container, level1_arr);
populateSelectList(operatorContainer, operator);

createTable(level1_arr, level2_arr);

initializeEventListeners(
  mainContainer,
  fieldsContainer,
  level1Container,
  operatorContainer,
  level2Container,
  addButton,
  clearAllButton,
  submitButton,
  tagsArray,
  {
    actionStatus,
    fieldData,
    valueData,
    operatorData,
    currentIndex,
    selectedTag,
    generatedID,
  }
);
