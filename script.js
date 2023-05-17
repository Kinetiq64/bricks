var canvas, canvasContext;
var brickImage = new Image();
brickImage.src = 'oblak.jpg';var score = 0;
const BRICK_W = 135;
const BRICK_H = 35;
const BRICK_GAP = 4;
const BRICK_COLS = 6;
const BRICK_ROWS = 7;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var brickCount = 0;
var ballX = 75;
var ballSpeedX = 3;
var ballY = 75;
var ballSpeedY = 4;
var paddleX = 400;
const PADDLE_THICKNESS = 15;
const PADDLE_WIDTH = 110;
const PADDLE_DIST_FROM_EDGE = 60;
var mouseX = 0;
var mouseY = 0;
var lives = 3;
var gameStarted = false;
var paddleMoveAllowed = false;
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);
window.onload = function () {
canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');
var framesPerSecond = 60;
setInterval(updateAll, 1000 / framesPerSecond);  canvas.addEventListener('mousemove', updateMousePos);
brickReset();
ballReset();
}

function updateAll() {
movement();
playArea();
}
function startGame() {
  startButton.style.display = 'none';
  gameStarted = true; 
  ballReset(); 
  paddleMoveAllowed = true;
}
function ballReset() {
  if (gameStarted && lives > 1) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  } else {
    alert("Game Over!");
    resetGame();
    location.reload(); // Refresh the page
  }
  
}function ballMove() {
  if (!gameStarted) return; 
ballX += ballSpeedX;
ballY += ballSpeedY;  

    if (ballX > canvas.width - 10 && ballSpeedX > 0) {
        ballSpeedX = -ballSpeedX; 
    } else if (ballX < 10 && ballSpeedX < 0) {
        ballSpeedX = -ballSpeedX; 
    }

    if (ballY < 10 && ballSpeedY < 0) {
        ballSpeedY = -ballSpeedY;
    }


if (ballY > canvas.height) {
  if (lives > 1) {
    
    lives--;
    ballReset();
  } else {
    
    alert("Game Over!");
    resetGame();
  }
} else if (ballY < 0 && ballSpeedY < 0) {
  ballSpeedY = -ballSpeedY;
}  
}function resetGame() {

lives = 3;
brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
brickCount = 0;
score = 0; 


ballReset();
brickReset();
}function ballReset() {
if (lives > 1) {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
} else {
  
  alert("Game Over!");
  resetGame();
  location.reload(); // Refresh the page
}
}function brickReset() {
brickCount = 0;
for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
  if (i < 3 * BRICK_COLS) {
    brickGrid[i] = false;
  } else {
    brickGrid[i] = true;
    brickCount++;
  }
}
}
function ballMove() {
  if (!gameStarted) return; 

ballX += ballSpeedX;
ballY += ballSpeedY;

    if (ballX > canvas.width - 10 && ballSpeedX > 0) {
        ballSpeedX = -ballSpeedX; 
    } else if (ballX < 10 && ballSpeedX < 0) {
        ballSpeedX = -ballSpeedX; 
    }

    if (ballY < 10 && ballSpeedY < 0) {
        ballSpeedY = -ballSpeedY; 
    }


if (ballY > canvas.height) {
  ballReset();
  lives--;
} else if (ballY < 0 && ballSpeedY < 0) {
  ballSpeedY = -ballSpeedY;
}

if (ballX > canvas.width && ballSpeedX > 0) {
  ballSpeedX = -ballSpeedX;
} else if (ballX < 0 && ballSpeedX < 0) {
  ballSpeedX = -ballSpeedX;
}
}function isBrickAtColRow(col, row) {
if (col >= 0 && col < BRICK_COLS &&
  row >= 0 && row < BRICK_ROWS) {
  var brickIndexUnderCoord = rowColToArrayIndex(col, row);
  return brickGrid[brickIndexUnderCoord];
} else {
  return false;
}
}function ballBrickColl() {
var ballBrickCol = Math.floor(ballX / BRICK_W);
var ballBrickRow = Math.floor(ballY / BRICK_H);
var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
  if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
    brickGrid[brickIndexUnderBall] = false;
    brickCount--;
    score += 10;      var prevBallX = ballX - ballSpeedX;
    var prevBallY = ballY - ballSpeedY;
    var prevBrickCol = Math.floor(prevBallX / BRICK_W);
    var prevBrickRow = Math.floor(prevBallY / BRICK_H);      var bothTestsFailed = true;      if (prevBrickCol !== ballBrickCol) {
      if (isBrickAtColRow(prevBrickCol, ballBrickRow) === false) {
        ballSpeedX = -ballSpeedX;
        bothTestsFailed = false;
      }
    }      if (prevBrickRow !== ballBrickRow) {
      if (isBrickAtColRow(ballBrickCol, prevBrickRow) === false) {
        ballSpeedY = -ballSpeedY;
        bothTestsFailed = false;
      }
    }      if (bothTestsFailed) {
      ballSpeedX = -ballSpeedX;
      ballSpeedY = -ballSpeedY;
    }
  }
}
}if (ballY > canvas.height && lives > 1) {lives--;
ballReset();
}
function paddleMove() {
  if (!paddleMoveAllowed) return;
  
  var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleX + PADDLE_WIDTH;
  
  var paddleCenterX = paddleX + PADDLE_WIDTH / 2;
  var paddleCenterY = paddleTopEdgeY + PADDLE_THICKNESS / 2;
  var ballCenterX = ballX;
  var ballCenterY = ballY;
  
  var distX = Math.abs(paddleCenterX - ballCenterX);
  var distY = Math.abs(paddleCenterY - ballCenterY);
  
  if (distX <= PADDLE_WIDTH / 2 + 10 && distY <= PADDLE_THICKNESS / 2 + 10) {
    ballSpeedY = -ballSpeedY;
    var ballDistFromCenterX = ballX - paddleCenterX;
    ballSpeedX = ballDistFromCenterX * 0.10;
    
    if (brickCount === 0) {
      brickReset();
    }
  }
}function movement() {
ballMove();
if (ballY > canvas.height && lives > 1) {
  lives--;
  ballReset();
}
ballBrickColl();
paddleMove();
}
function updateMousePos(evt) {
var rect = canvas.getBoundingClientRect();
var root = document.documentElement;mouseX = evt.clientX - rect.left - root.scrollLeft;
mouseY = evt.clientY - rect.top - root.scrollTop;paddleX = mouseX - PADDLE_WIDTH / 2;
}
function playArea() {colorRect(0, 0, canvas.width, canvas.height, 'rgba(0,0,0,0)',);colorCircle();colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');drawBricks();
drawLives();
}function colorRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillRect(leftX, topY, width, height);
  colorCircle();
}function colorText(showWords, textX, textY, fillColor) {
canvasContext.fillStyle = fillColor;
canvasContext.fillText(showWords, textX, textY);
}function colorCircle() {
  var ballImage = new Image();
  ballImage.src = 'ball3.png'; 
  canvasContext.drawImage(ballImage, ballX - 10, ballY - 10, 20, 20);
}function drawBricks() {
for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
  for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
    var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
    if (brickGrid[arrayIndex]) {
      var brickLeftX = eachCol * BRICK_W;
      var brickTopY = eachRow * BRICK_H;
      canvasContext.drawImage(brickImage, brickLeftX, brickTopY, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP);
    }
  }
}
}
function rowColToArrayIndex(col, row) {
return col + BRICK_COLS * row;
}function drawLives() {

canvasContext.font = '24px Arial';
canvasContext.fillStyle = 'white';
canvasContext.fillText('Lives: ' + lives, canvas.width - 100, 30); 
canvasContext.fillText('Points: ' + score, 20, 30);
}