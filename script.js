const sizePicker = document.querySelector('.size-picker');
const pixelCanvas = document.querySelector('.pixel-canvas');
const quickFill = document.querySelector('.quick-fill');
const eraseMode = document.querySelector('.erase-mode');
const drawMode = document.querySelector('.draw-mode');
const colorPickerJs = document.getElementById('colorPicker');
const brushColor = document.querySelector('.brushcolor');

let colorPicked = "#000000"
let gridHeight = document.querySelector('.input-height').value;
let gridWidth = document.querySelector('.input-width').value;
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

makeGrid(gridHeight, gridWidth);


// Upon user's submitting height and width selections, callback function (inside method) calls makeGrid function.
// But event method preventDefault() first intercepts the 'submit' event, which would normally submit the form and refresh the page, preventing makeGrid() from being processed
sizePicker.addEventListener('submit', function(e) {
  e.preventDefault();
  makeGrid(gridHeight, gridWidth);
});
document.querySelector('.input-height').addEventListener('change', function(e) {
  e.preventDefault();
  gridHeight = e.target.value;
});
document.querySelector('.input-width').addEventListener('change', function(e) {
  e.preventDefault();
  gridWidth = e.target.value;
});

// Listens for mouse pointer press and release on grid. Changes value to true when pressed, but sets it back to false as soon as released
pixelCanvas.addEventListener('mousedown', function(e) {
  down = true;
  pixelCanvas.addEventListener('mouseup', function() {
    down = false;
  });
  pixelCanvas.addEventListener('mouseover', function(e) {
    // 'color' defined here rather than globally so JS checks whether user has changed color with each new mouse press on cell
    const colorPickerJs = document.querySelector('.color-picker').value;
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
quickFill.addEventListener('click', function(e) {
  e.preventDefault();
  pixelCanvas.querySelectorAll('td').forEach(td => td.style.backgroundColor = colorPicked);
});

// Removes color from cell upon double-click
pixelCanvas.addEventListener('dblclick', e => {
  e.target.style.backgroundColor = null;
});

// Allows for drag and single-cell erasing upon clicking 'erase' button, code for double-click erase functionality (Without entering erase mode) is above
eraseMode.addEventListener('click', function() {
  // Enables drag erasing while in erase mode
  pixelCanvas.addEventListener('mousedown', function(e) {
    down = true;
    pixelCanvas.addEventListener('mouseup', function() {
      down = false;
    });
    // Ensures cells won't be erased if grid is left while pointer is held down
    pixelCanvas.addEventListener('mouseleave', function() {
      down = false;
    });
    pixelCanvas.addEventListener('mouseover', function(e) {
      // While mouse pointer is pressed and within grid boundaries, empties cell contents
      if (down) {
        if (e.target.tagName === 'TD') {
          e.target.style.backgroundColor = null;
        }
      }
    });
  });
  // Enables single-cell erase while in erase mode
  pixelCanvas.addEventListener('mousedown', function(e) {
    e.target.style.backgroundColor = null;
  });
});

// Allows user to return to (default) draw mode after using 'erase' button
drawMode.addEventListener('click', function() {
  pixelCanvas.addEventListener('mousedown', function(e) {
    down = true;
    pixelCanvas.addEventListener('mouseup', function() {
      down = false;
    });
    // Ensures cells won't be colored if grid is left while pointer is held down
    pixelCanvas.addEventListener('mouseleave', function() {
      down = false;
    });
    pixelCanvas.addEventListener('mouseover', function(e) {
      // While mouse pointer is pressed and within grid boundaries, fills cell with selected color
      if (down) {
        if (e.target.tagName === 'TD') {
          e.target.style.backgroundColor = colorPicked;
        }
      }
    });
  });
  // Enables single-cell coloring while in draw mode
  pixelCanvas.addEventListener('mousedown', function(e) {
    if (e.target.tagName !== 'TD') return;
    e.target.style.backgroundColor = colorPicked;
  });
});

// Allows selected color to change when using preset button colors and generated color picker
colorPickerJs.addEventListener("change", function() {
  colorPicked = colorPickerJs.value;
  brushColor.style.backgroundColor = colorPicked;
});
document
  .getElementById("button2")
  .addEventListener("click", function() {
    colorPicked = "#0000FF";
    colorPickerJs.value = colorPicked;
    brushColor.style.backgroundColor = colorPicked;
  });
document
  .getElementById("button3")
  .addEventListener("click", function() {
    colorPicked = "#008000";
    colorPickerJs.value = colorPicked;
    brushColor.style.backgroundColor = colorPicked;
  });
document
  .getElementById("button4")
  .addEventListener("click", function() {
    colorPicked = "#FFFF00";
    colorPickerJs.value = colorPicked;
    brushColor.style.backgroundColor = colorPicked;
  });
document
  .getElementById("button5")
  .addEventListener("click", function() {
    colorPicked = "#FFA500";
    colorPickerJs.value = colorPicked;
    brushColor.style.backgroundColor = colorPicked;
  });
document
  .getElementById("button6")
  .addEventListener("click", function() {
    colorPicked = "#FF0000";
    colorPickerJs.value = colorPicked;
    brushColor.style.backgroundColor = colorPicked;
  });


// Allows button to pull random images from local folder 
function getRandomImage() {
  return document.querySelector(".picturecontainer").innerHTML = `<img src="images/${Math.floor(Math.random() * 335)}.webp" />`;
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
  };
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

