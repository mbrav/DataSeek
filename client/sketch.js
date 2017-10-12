
var clientsData;

var xspacing = 40; // Distance between each horizontal location
var w; // Width of entire wave
var theta = 0.0; // Start angle at 0
var amplitude = 75.0; // Height of wave
var period = 500.0; // How many pixels before the wave repeats
var dx; // Value for incrementing x
var yvalues; // Using an array to store height values for the wave
var cirlceSize = 30;

function setup() {
  // createCanvas(200, 200);
  createCanvas(window.innerWidth, window.innerHeight);
  calc();
}

function draw() {
  background(0);
  calcWave();
  renderWave();
  frameRate(20);
}

function calc() {
  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.06;

  // For every x value, calculate a y value with sine function
  var x = theta;
  for (var i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }
}

function renderWave() {
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (var x = 0; x < yvalues.length; x++) {
    ellipse(x * xspacing, height-amplitude-cirlceSize + yvalues[x], cirlceSize, cirlceSize);
  }
}

// P5.js
// function setup() {
//   // createCanvas(window.innerWidth, window.innerHeight);
// }
//
// function draw() {
//   // if (mouseIsPressed) {
//   //   fill(0);
//   // } else {
//   //   fill(255);
//   // }
//   // ellipse(mouseX, mouseY, 80, 80);
// }

function windowResized() {
  calc();
  resizeCanvas(windowWidth, windowHeight);
}
