const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearButton = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

// Get items from localStorage if they exist
const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
};

// Create reusable icon
const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

// Create reusable button
const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  button.type = 'button';
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

// Add items to localStorage
const onAddItemSubmit = (e) => {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert('That item is already on the list!');
      return;
    }
  }

  // Add item to DOM
  addItemToDOM(newItem);

  // Add item to localStorage
  addItemToStorage(newItem);

  checkUI();
};

// Add item to DOM
const addItemToDOM = (item) => {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
};

// Add item to localStorage
const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // Convert to JSON string and add to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

// Get items from localStorage
const getItemsFromStorage = () => {
  let itemsFromStorage = [];

  if (localStorage.getItem('items') !== null) {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
};

// Select item
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

//
const checkIfItemExist = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
};

// Toggle Edit Mode
const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
};

// Delete item
const removeItem = (item) => {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from localStorage
    removeItemFromLocalStorage(item.textContent);

    checkUI();
  }
};

// Remove item from localStorage
const removeItemFromLocalStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Reset to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

// Clear all items
const clearItems = (e) => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear items from localStorage
  localStorage.removeItem('items');
  checkUI();
};

// Filter items
const filterItems = (e) => {
  const listItems = itemList.querySelectorAll('li');
  const filterText = e.target.value.toLowerCase();

  listItems.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(filterText) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

// Update UI
const checkUI = () => {
  itemInput.value = '';
  const listItems = itemList.querySelectorAll('li');

  if (listItems.length) {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  } else {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
};

// Initialize app
const init = () => {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
