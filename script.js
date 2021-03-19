const sizePicker = document.querySelector('.size-picker');
const pixelCanvas = document.querySelector('.pixel-canvas');
const quickFill = document.querySelector('.quick-fill');
const eraseMode = document.querySelector('.erase-mode');
const colorPickerJs = document.getElementById('colorPicker');
const brushColor = document.querySelector('.brushcolor');
const buttons = document.querySelectorAll('.buttons');

let colorPicked = "#000000"
let gridHeight = document.querySelector('.input-height').value;
let gridWidth = document.querySelector('.input-width').value;
let buttonColors = {
  colors: ['#0000FF', '#008000', '#FFFF00', '#FFA500', '#FF0000']
};
brushColor.style.backgroundColor = colorPicked;

function makeGrid(gridHeight, gridWidth, gridArray) {
  // If grid already present, clears any cells that have been filled in
  while (pixelCanvas.firstChild) {
    pixelCanvas.removeChild(pixelCanvas.firstChild);
  }
  // Creates rows and cells
  for (let i = 1; i <= gridHeight; i++) {
    let gridRow = document.createElement('tr');
    pixelCanvas.appendChild(gridRow);
    for (let j = 1; j <= gridWidth; j++) {
      let gridCell = document.createElement('td');
      gridRow.appendChild(gridCell);
    }
  }
}

// Upon user's submitting height and width selections, callback function (inside method) calls makeGrid function.
// But event method preventDefault() first intercepts the 'submit' event, which would normally submit the form and refresh the page, preventing makeGrid() from being processed
sizePicker.addEventListener('submit', (e) => {
  e.preventDefault();
  makeGrid(gridHeight, gridWidth);
});
document.querySelector('.input-height').addEventListener('change', (e) => {
  e.preventDefault();
  gridHeight = e.target.value;
});
document.querySelector('.input-width').addEventListener('change', (e) => {
  e.preventDefault();
  gridWidth = e.target.value;
});

function createEventListeners() {
  // Allows default drag and draw on grid squares to be present when entering or reloading page
  pixelCanvas.addEventListener('mousedown', (e) => {
    down = true;
    pixelCanvas.addEventListener('mouseup', () => {
      down = false;
    });
    pixelCanvas.addEventListener('mouseover', (e) => {
      // While mouse pointer is pressed and within grid boundaries, fills cell with selected color
      if (down) {
        // 'TD' capitalized because element.tagName returns upper case for DOM trees that represent HTML elements
        if (e.target.tagName === 'TD') {
          e.target.style.backgroundColor = colorPicked;
        }
      }
    });
  });
  // Adds color-fill functionality. e.preventDefault(); intercepts page refresh on button click
  quickFill.addEventListener('click', (e) => {
    e.preventDefault();
    pixelCanvas.querySelectorAll('td').forEach(td => td.style.backgroundColor = colorPicked);
  });
  // Removes color from cell upon double-click
  pixelCanvas.addEventListener('dblclick', (e) => {
    e.target.style.backgroundColor = null;
  });
  // Allows for drag erasing upon clicking 'erase' button
  eraseMode.addEventListener('click', (e) => {
    colorPicked = null;
  });
  // Allows selected color to change when using preset button colors and generated color picker
  colorPickerJs.addEventListener("change", () => {
    colorPicked = colorPickerJs.value;
    brushColor.style.backgroundColor = colorPicked;
  });
}

// Enables the palette buttons to generate a predefined color when clicked
function addColorToButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      colorPicked = buttonColors.colors[i];
      colorPickerJs.value = colorPicked;
      brushColor.style.backgroundColor = colorPicked;
    });
  }
}

// Allows button to pull random images from local folder 
function getRandomImage() {
  document.querySelector('.btn-success').addEventListener('click', () => {
    return document.querySelector(".picturecontainer").innerHTML = `<img src="images/${Math.floor(Math.random() * 335)}.webp" />`;
  });
}

// Allows save button to store grid data
function saveBtn() {
  let gridArray = [];
  let getGrid = document.querySelectorAll('.pixel-canvas tr td');
  for (let i = 0; i < getGrid.length; i++) {
    let gridColor = getGrid[i];
    gridArray.push(gridColor.style.backgroundColor);
  }

  let gridInfo = {
    gridWidth: gridWidth,
    gridHeight: gridHeight,
    grid: gridArray
  }
  localStorage.setItem('gridSave', JSON.stringify(gridInfo));
}

// Allows load button to retrieve stored grid data
function loadBtn() {
  pixelCanvas.removeChild(pixelCanvas.firstChild);
  let savedGridInfo = JSON.parse(localStorage.getItem('gridSave'));
  makeGrid(savedGridInfo.gridHeight, savedGridInfo.gridWidth);
  let loadGrid = document.querySelectorAll('.pixel-canvas tr td');
  for (let i = 0; i < loadGrid.length; i++) {
    loadGrid[i].style.backgroundColor = savedGridInfo.grid[i];
  }
}

// Ensures all functions are being called that require it
function init() {
  makeGrid(gridHeight, gridWidth);
  addColorToButtons();
  getRandomImage();
  createEventListeners();
}

init();