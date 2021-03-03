console.log("hi")
const pixelCanvas = document.querySelector('.pixel-canvas');

/* Enables color dragging with selected color (code for filling in single cell is above). (No click on 'draw' mode needed; this is default mode) */
let down = false; // Tracks whether or not mouse pointer is pressed

/* Listens for mouse pointer press and release on grid. Changes value to true when pressed, but sets it back to false as soon as released */
pixelCanvas.addEventListener('mousedown', function(e) {
	down = true;
	pixelCanvas.addEventListener('mouseup', function() {
		down = false;
	});
  /* Ensures cells won't be colored if grid is left while pointer is held down */
  pixelCanvas.addEventListener('mouseleave', function() {
    down = false;
  });

})

