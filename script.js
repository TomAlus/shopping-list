const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearButton = document.getElementById('clear');

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

  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
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

// Delete item
const removeItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    e.target.parentElement.parentElement.remove();
    checkUI();
  }
};

// Clear all items
const clearItems = (e) => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
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
  const listItems = itemList.querySelectorAll('li');
  if (listItems.length) {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  } else {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  }
};

// Initialize app
const init = () => {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', removeItem);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
