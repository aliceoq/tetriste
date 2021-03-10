const ROWS = 10;
const COLS = 12;
const SPAWN_X = 100;
const SPAWN_Y = -50;
const BLOCK_SIZE = 25;
const SHAPES = [
  [[0, 0, 0], [0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
  [[0, 0, 0], [0, 0, 0], [1, 1, 1]]
];
const COLORS = ['orange', 'pink', 'blue', 'red', 'pink', 'red', 'purple']

var curr_screen = emptyScreen();
var curr_x = SPAWN_X;
var curr_y = SPAWN_Y;
var curr_shape = SHAPES[0];
var curr_color = 'orange';
var ctx = document.getElementById('canvas').getContext('2d');

function init() {
  ctx.canvas.width = COLS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;

  window.setTimeout(draw, 500);
}

function emptyScreen() {
  return Array.from({ length: ROWS }, () => Array(COLS ).fill(0));
}

function newPiece() {
  curr_shape = SHAPES[Math.floor(Math.random() * 3)];

  aux = curr_color;
  while (aux == curr_color){
    curr_color = COLORS[Math.floor(Math.random() * 7)];
  }

  curr_y = SPAWN_Y;
  curr_x = SPAWN_X;

  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    window.setTimeout(draw, 1000);
  }
  else {
    document.getElementById('result').innerHTML = 'perdeu';
  }
}

function draw() {
  clearShape();
  drawShape();

  curr_y += BLOCK_SIZE;

  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    window.setTimeout(draw, 1000);
  }
  else {
    newPiece();
  }
}

function clearShape() {
  posX = curr_x;
  posY = curr_y - BLOCK_SIZE;
  
  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (curr_shape[i][j] == '1' && posY >= 0) {
        //curr_screen[posX/BLOCK_SIZE][posY/BLOCK_SIZE] = 0;
        ctx.clearRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
      }
      posX += BLOCK_SIZE;
    }
    posY += BLOCK_SIZE;
    posX = curr_x;
  }
}

function clearShapeScreen() {
  posX = curr_x/BLOCK_SIZE;
  posY = (curr_y - BLOCK_SIZE)/BLOCK_SIZE;

  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (curr_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 0;
      }
      posX += 1;
    }
    posY += 1;
    posX = curr_x/BLOCK_SIZE;
  }
}

function fillShapeScreen() {
  posX = curr_x/BLOCK_SIZE;
  posY = (curr_y - BLOCK_SIZE)/BLOCK_SIZE;

  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (curr_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 1;
      }
      posX += 1;
    }
    posY += 1;
    posX = curr_x/BLOCK_SIZE;
  }
}

function drawShape() {
  posX = curr_x;
  posY = curr_y;
  
  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (curr_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX/BLOCK_SIZE][posY/BLOCK_SIZE] = 1;
        ctx.fillStyle = curr_color;
        ctx.fillRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
      }
      posX += BLOCK_SIZE;
    }
    posY += BLOCK_SIZE;
    posX = curr_x;
  }
}

function isPositionValid(posX, posY) {
  let flag = true;

  clearShapeScreen();

  for (i = 0 ; i < 3 && flag; i++) {
    for (j = 0 ; j < 3 && flag; j++) {
      if (curr_shape[i][j] == '1') {
        if (posX >= COLS || posY >= ROWS) flag = false;
        else if (posY >= 0 && curr_screen[posX][posY] == 1) flag = false;
      }
      posX += 1;
    }
    posY += 1;
    posX = curr_x/BLOCK_SIZE;
  } 

  console.log(flag);

  if(flag) return flag;
  
  fillShapeScreen();
  return flag;
}

init();