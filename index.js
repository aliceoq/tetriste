const ROWS = 20;
const COLS = 12;
const SPAWN_X = 100;
const SPAWN_Y = -50;
const BLOCK_SIZE = 25;
const SHAPES = [
  [[0, 0, 0], [0, 0, 1], [1, 1, 1]],
  [[0, 0, 0], [1, 0, 0], [1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
  [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]],
  [[0, 0, 0], [0, 1, 1], [1, 1, 0]]
];
const COLORS = ['orange', 'hotpink', 'blue', 'red', 'mediumseagreen', 'red', 'blueviolet']
const ctx = document.getElementById('canvas').getContext('2d');

var curr_screen = emptyScreen();
var curr_x = SPAWN_X;
var curr_y = SPAWN_Y;
var curr_color = 'orange';
var curr_shape = SHAPES[5].map(function(arr) {
  return arr.slice();
});

var previous_x = SPAWN_X;
var previous_y = SPAWN_Y;
var previous_shape = curr_shape;

var flagNoMove = false;

function init() {
  ctx.canvas.width = COLS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;

  newPiece();
}

function newPiece() {
  curr_shape = SHAPES[Math.floor(Math.random() * 5)].map(function(arr) {
    return arr.slice();
  });
  previous_shape = curr_shape;

  aux = curr_color;
  while (aux == curr_color){
    curr_color = COLORS[Math.floor(Math.random() * 7)];
  }

  curr_y = SPAWN_Y;
  curr_x = SPAWN_X;
  previous_x = -100;
  previous_y = -100;

  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    window.setTimeout(draw, 500);
  }
  else {
    document.getElementById('result').innerHTML = 'perdeu D:';
  }
}

document.addEventListener('keydown', (e) => {
  if (flagNoMove) return;
  switch(e.code) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      rotateShape();
      break;
    case "ArrowDown":
      if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE))
        move();
      break;
    default:
      break;
  }
});

function emptyScreen() {
  return Array.from({ length: COLS}, () => Array(ROWS ).fill(0));
}

function draw() { 
  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    move();
    window.setTimeout(draw, 500);
  }
  else {
    checkLine();
    newPiece();
  }
}

function move() {
  clearShape();
  drawShape();

  previous_x = curr_x;
  previous_y = curr_y;

  curr_y += BLOCK_SIZE;
}

function moveRight() {
  if (curr_y - BLOCK_SIZE < 0) return;
  if (isPositionValid(curr_x/BLOCK_SIZE + 1, curr_y/BLOCK_SIZE - 1)) {
    previous_x = curr_x;
    curr_y -= BLOCK_SIZE;
    curr_x += BLOCK_SIZE;

    move();
    window.clearTimeout(draw);
  }
}

function moveLeft() {
  if (curr_y - BLOCK_SIZE < 0) return;
  if (isPositionValid(curr_x/BLOCK_SIZE - 1, curr_y/BLOCK_SIZE - 1)) {
    previous_x = curr_x;
    curr_y -= BLOCK_SIZE;
    curr_x -= BLOCK_SIZE;

    move();
    window.clearTimeout(draw);
  }
}

function clearShape() {
  posX = previous_x;
  posY = previous_y;
  
  for (i = 0 ; i < previous_shape.length ; i++) {
    for (j = 0 ; j < previous_shape[i].length ; j++) {
      if (previous_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX/BLOCK_SIZE][posY/BLOCK_SIZE] = 0;
        ctx.clearRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
      }
      posX += BLOCK_SIZE;
    }
    posY += BLOCK_SIZE;
    posX = previous_x;
  }
}

function drawShape() {
  posX = curr_x;
  posY = curr_y;
  
  for (i = 0 ; i < curr_shape.length ; i++) {
    for (j = 0 ; j < curr_shape[i].length ; j++) {
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

function clearShapeMatrix() {
  posX = previous_x/BLOCK_SIZE;
  posY = previous_y/BLOCK_SIZE;

  for (i = 0 ; i < previous_shape.length ; i++) {
    for (j = 0 ; j < previous_shape[i].length ; j++) {
      if (previous_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 0;
      }
      posX += 1;
    }
    posY += 1;
    posX = previous_x/BLOCK_SIZE;
  }
}

function fillShapeMatrix() {
  posX = previous_x/BLOCK_SIZE;
  posY = previous_y/BLOCK_SIZE;

  for (i = 0 ; i < previous_shape.length ; i++) {
    for (j = 0 ; j < previous_shape[i].length ; j++) {
      if (previous_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 1;
      }
      posX += 1;
    }
    posY += 1;
    posX = previous_x/BLOCK_SIZE;;
  }
}

function isPositionValid(posX, posY) {
  let flag = true;
  let posX_aux = posX;

  flagNoMove = true;

  clearShapeMatrix();

  for (i = 0 ; i < curr_shape.length && flag ; i++) {
    for (j = 0 ; j < curr_shape[i].length && flag ; j++) {
      if (curr_shape[i][j] == '1') {
        if (posX >= COLS || posY >= ROWS || posX < 0) flag = false;
        else if (posY >= 0 && posX >= 0 && curr_screen[posX][posY] == 1) flag = false;
      }
      posX += 1;
    }
    posY += 1;
    posX = posX_aux;
  } 

  fillShapeMatrix();

  flagNoMove = false;
  
  return flag;
}

function checkLine() {
  for (i = 0 ; i < ROWS ; i++) {
    let flag = true;
    for (j = 0 ; j < COLS && flag ; j++) {
      if (curr_screen[j][i] == 0) {
        flag = false;
      }
    }
    if (flag) deleteLine(i);
  }
}

function deleteLine(line) {
  for (i = line ; i > 0 ; i--) {
    for (j = 0 ; j < COLS ; j++) {
      curr_screen[j][i] = curr_screen[j][i-1];
    }
  }

  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, BLOCK_SIZE*line);
  ctx.putImageData(imageData, 0, BLOCK_SIZE);
  ctx.clearRect(0, 0, ctx.canvas.width, BLOCK_SIZE);
}

function rotateShape() {
  var aux_shape = curr_shape.map(function(arr) {
    return arr.slice();
  });

  for (i = 0 ; i < aux_shape.length ; i++) {
    for (j = 0 ; j < aux_shape[i].length ; j++) {
      curr_shape[i][j] = aux_shape[j][aux_shape.length-i-1] ;
    }
  }

  previous_shape = aux_shape;
  clearShapeMatrix();

  curr_y -= BLOCK_SIZE;
  if (curr_y >= 0 && isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    move();
    previous_shape = curr_shape;  

    window.clearTimeout(draw);
  }
  else {
    curr_y += BLOCK_SIZE;
    fillShapeMatrix();

    curr_shape = aux_shape;
    previous_shape = curr_shape;
  }
}

init();