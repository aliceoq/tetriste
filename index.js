const ROWS = 20;
const COLS = 12;
const SPAWN_X = 100;
const SPAWN_Y = -50;
const BLOCK_SIZE = 25;
const SHAPES = [
  [[0, 0, 0], [0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [0, 1, 0], [1, 1, 1]],
  [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 1], [0, 0, 1], [0, 0, 1]]
];
const COLORS = ['orange', 'hotpink', 'blue', 'red', 'mediumseagreen', 'red', 'blueviolet']

var curr_screen = emptyScreen();
var curr_x = SPAWN_X;
var curr_y = SPAWN_Y;
var curr_shape = SHAPES[0].map(function(arr) {
  return arr.slice();
});
var previous_x = SPAWN_X;
var previous_y = SPAWN_Y;
var previous_shape = SHAPES[0].slice();

var curr_color = 'orange';
var ctx = document.getElementById('canvas').getContext('2d');
var flagNoMove = false;

document.addEventListener('keydown', (e) => {
  if (e.code === "ArrowLeft" && !flagNoMove) {
    flagNoMove = true;
    if (isPositionValid(curr_x/BLOCK_SIZE - 1, curr_y/BLOCK_SIZE)) {
      previous_x = curr_x;
      curr_x -= BLOCK_SIZE;
      playerMove();
      window.clearTimeout(draw);
      //window.setTimeout(draw, 500);
    }
    flagNoMove = false;
  }
  else if (e.code === "ArrowRight" && !flagNoMove) {
    flagNoMove = true;
    if (isPositionValid(curr_x/BLOCK_SIZE + 1, curr_y/BLOCK_SIZE)) {
      previous_x = curr_x;
      curr_x += BLOCK_SIZE;
      playerMove();
      window.clearTimeout(draw);
      //window.setTimeout(draw, 500);
    }
    flagNoMove = false;
  }
  else if (e.code === "ArrowUp" && !flagNoMove) {
    flagNoMove = true;
    rotatePiece();
    flagNoMove = false;
  }
  else if (e.code === "ArrowDown" && !flagNoMove) {
    flagNoMove = true;
    if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
      playerMove();
    }
    flagNoMove = false;
  }
});

function init() {
  ctx.canvas.width = COLS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;

  window.setTimeout(draw, 500);
}

function emptyScreen() {
  return Array.from({ length: COLS}, () => Array(ROWS ).fill(0));
}

function newPiece() {
  curr_shape = SHAPES[Math.floor(Math.random() * 4)].map(function(arr) {
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
    window.setTimeout(draw, 250);
  }
  else {
    document.getElementById('result').innerHTML = 'perdeu';
  }
}

function draw() { 
  flagNoMove = true;

  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    clearShape();
    drawShape();

    previous_x = curr_x;
    previous_y = curr_y;

    curr_y += BLOCK_SIZE;

    window.setTimeout(draw, 500);
  }
  else {
    checkLine();
    flagNoMove = false;
    newPiece();
  }
}

function playerMove() {
  clearShape();
  drawShape();

  previous_x = curr_x;
  previous_y = curr_y;

  curr_y += BLOCK_SIZE;
}

function clearShape() {
  posX = previous_x;
  posY = previous_y;
  
  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
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

function clearShapeScreen() {
  posX = previous_x/BLOCK_SIZE;
  posY = previous_y/BLOCK_SIZE;

  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (previous_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 0;
      }
      posX += 1;
    }
    posY += 1;
    posX = previous_x/BLOCK_SIZE;
  }
}

function fillShapeScreen() {
  posX = previous_x/BLOCK_SIZE;
  posY = previous_y/BLOCK_SIZE;

  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      if (previous_shape[i][j] == '1' && posY >= 0) {
        curr_screen[posX][posY] = 1;
      }
      posX += 1;
    }
    posY += 1;
    posX = previous_x/BLOCK_SIZE;;
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
  document.getElementById('result3').innerHTML = posY;
  let flag = true;
  let posX_aux = posX;

  flagNoMove = true;

  clearShapeScreen();

  for (i = 0 ; i < 3 && flag; i++) {
    for (j = 0 ; j < 3 && flag; j++) {
      if (curr_shape[i][j] == '1') {
        if (posX >= COLS || posY >= ROWS || posX < 0) flag = false;
        else if (posY >= 0 && posX >= 0 && curr_screen[posX][posY] == 1) {

          flag = false;
        }
      }
      posX += 1;
    }
    posY += 1;
    posX = posX_aux;
  } 

  if(flag) {
    flagNoMove = false;
    return flag;
  }

  fillShapeScreen();

  flagNoMove = false;
  
  
  return flag;
}

function checkLine() {
  for (i = 0 ; i < ROWS ; i++) {
    let flagOk = true;
    for (j = 0 ; j < COLS && flagOk; j++) {
      if (curr_screen[j][i] == 0) {
        flagOk = false;
      }
    }
    if (flagOk) deleteLine(i);
  }
}

function deleteLine(line) {
  console.log('deletando')
  for (i = line ; i > 0 ; i--) {
    for (j = 0 ; j < COLS ; j++) {
      
      curr_screen[j][i] = curr_screen[j][i-1];
      if (i == ROWS - 1) console.log(curr_screen[j][i]);
      // if (curr_screen[j][i-1] == 1) {
      //   ctx.
      //   ctx.fillRect(j*BLOCK_SIZE, (i-1)*BLOCK_SIZE);
      // }
    }
  }

  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, BLOCK_SIZE*line);
  ctx.putImageData(imageData, 0, BLOCK_SIZE);
  // now clear the right-most pixels:
  ctx.clearRect(0, 0, ctx.canvas.width, BLOCK_SIZE);
}

function rotatePiece() {
  
  var aux_shape = curr_shape.map(function(arr) {
    return arr.slice();
  });

  for (i = 0 ; i < 3 ; i++) {
    for (j = 0 ; j < 3 ; j++) {
      curr_shape[i][j] = aux_shape[j][2-i] ;
    }
  }

  //curr_y -= BLOCK_SIZE;
  previous_shape = aux_shape;
  clearShapeScreen();
  
  if (isPositionValid(curr_x/BLOCK_SIZE, curr_y/BLOCK_SIZE)) {
    //document.getElementById('result').innerHTML = curr_screen;
    
    playerMove();
    previous_shape = curr_shape;  
    window.clearTimeout(draw);
  }
  else {
    fillShapeScreen();
    document.getElementById('result').innerHTML = 'NOPE';
    curr_shape = aux_shape;
    previous_shape = curr_shape;
    //playerMove();
  }

  //document.getElementById('result2').innerHTML = screenString();
}

function screenString() {
  var string = "";
  for (i = 0 ; i < ROWS ; i++) {
    for (j = 0 ; j < COLS ; j++) {
      string += curr_screen[j][i] + " ";
    }
    string += "<br>";
  }
  return string;
}

init();