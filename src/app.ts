const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const WIDTH = 20;
const SNAKE_OFFSET = 10;
const FOOD_SIZE = 10;

const SNAKE_SPEED = 15;

const FOOD_INTERVAL_TIME = 10000;
const DRAW_NEW_FRAME_INTERVAL_TIME = 1000 / 10;

let FOOD_INTERVAL_ID: number;
let FRAME_INTERVAL_ID: number;

let SCORE = 0;

let UP = false;
let DOWN = false;
let LEFT = false;
let RIGHT = false;

let X_ORDINATE_SNAKE = 10;
let Y_ORDINATE_SNAKE = 10;
let X_ORDINATE_FOOD = 50; // just place holder. first ordinate is randomly generated anyway.
let Y_ORDINATE_FOOD = 50;

function resetKeys() {
  UP = false;
  DOWN = false;
  LEFT = false;
  RIGHT = false;
}

function keyDownHandler(e: KeyboardEvent) {
  switch (e.key) {
    case "h":
      LEFT = true;
      break;
    case "j":
      DOWN = true;
      break;
    case "k":
      UP = true;
      break;
    case "l":
      RIGHT = true;
      break;
    default:
      return;
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", resetKeys);

function collisionDetection() {
  const is_food_consumed =
    X_ORDINATE_SNAKE - SNAKE_OFFSET < X_ORDINATE_FOOD &&
    X_ORDINATE_SNAKE + WIDTH + SNAKE_OFFSET > X_ORDINATE_FOOD + FOOD_SIZE &&
    Y_ORDINATE_SNAKE - SNAKE_OFFSET < Y_ORDINATE_FOOD &&
    Y_ORDINATE_SNAKE + WIDTH + SNAKE_OFFSET > Y_ORDINATE_FOOD + FOOD_SIZE;

  if (is_food_consumed) {
    ++SCORE;
    clearInterval(FOOD_INTERVAL_ID);
    drawSnake("white");
    generateFood();
  }
}

function drawScore() {
  context.beginPath();
  context.font = "100 24px Sans";
  context.fillStyle = "white";
  context.fillText(`SCORE: ${SCORE}`, canvas.width - 150, 50);
  context.closePath();
}

function drawFood() {
  context.beginPath();
  context.fillStyle = "yellow";
  context.rect(X_ORDINATE_FOOD, Y_ORDINATE_FOOD, FOOD_SIZE, FOOD_SIZE);
  context.fill();
  context.closePath();
}

function drawSnake(color = "orange") {
  context.beginPath();
  context.fillStyle = color;
  context.rect(X_ORDINATE_SNAKE, Y_ORDINATE_SNAKE, WIDTH, WIDTH);
  context.fill();
  context.closePath();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function triggerSnakeDirectionOnKeyStroke() {
  if (UP) {
    Y_ORDINATE_SNAKE = Math.max(0, Y_ORDINATE_SNAKE - SNAKE_SPEED);
  } else if (DOWN) {
    Y_ORDINATE_SNAKE = Math.min(
      canvas.height - WIDTH,
      Y_ORDINATE_SNAKE + SNAKE_SPEED
    );
  } else if (LEFT) {
    X_ORDINATE_SNAKE = Math.max(0, X_ORDINATE_SNAKE - SNAKE_SPEED);
  } else if (RIGHT) {
    X_ORDINATE_SNAKE = Math.min(
      canvas.width - WIDTH,
      X_ORDINATE_SNAKE + SNAKE_SPEED
    );
  }
}

function draw() {
  clearCanvas();
  drawSnake();
  drawFood();
  drawScore();
  collisionDetection();

  triggerSnakeDirectionOnKeyStroke();
}

function generateRandomFoodOrdinate(size: number) {
  return Math.floor(Math.random() * size);
}
function generateFoodOrdinate() {
  X_ORDINATE_FOOD = generateRandomFoodOrdinate(canvas.width - FOOD_SIZE);
  Y_ORDINATE_FOOD = generateRandomFoodOrdinate(canvas.height - FOOD_SIZE);

  console.log("random ordinate x y", X_ORDINATE_FOOD, Y_ORDINATE_FOOD);
}

function startGame() {
  FRAME_INTERVAL_ID = setInterval(() => {
    draw();
  }, DRAW_NEW_FRAME_INTERVAL_TIME);
}
startGame();

function generateFood() {
  generateFoodOrdinate();
  FOOD_INTERVAL_ID = setInterval(() => {
    generateFoodOrdinate();
  }, FOOD_INTERVAL_TIME);
}
generateFood();
