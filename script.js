const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let foodYellow = false;
let yellowFoodTimer = 60; // seconds
let interval;

class Snake {
    constructor() {
        this.snakeArray = [{ x: 5, y: 5 }];
        this.direction = 'RIGHT';
    }

    move() {
        const head = { ...this.snakeArray[0] };

        if (this.direction === 'LEFT') head.x -= 1;
        if (this.direction === 'RIGHT') head.x += 1;
        if (this.direction === 'UP') head.y -= 1;
        if (this.direction === 'DOWN') head.y += 1;

        this.snakeArray.unshift(head);
        this.snakeArray.pop();
    }

    grow() {
        const tail = this.snakeArray[this.snakeArray.length - 1];
        this.snakeArray.push({ ...tail });
    }

    changeDirection(event) {
        if (event.keyCode === 37 && this.direction !== 'RIGHT') this.direction = 'LEFT';
        if (event.keyCode === 38 && this.direction !== 'DOWN') this.direction = 'UP';
        if (event.keyCode === 39 && this.direction !== 'LEFT') this.direction = 'RIGHT';
        if (event.keyCode === 40 && this.direction !== 'UP') this.direction = 'DOWN';
    }

    collidesWithWalls() {
        const head = this.snakeArray[0];
        return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
    }

    collidesWithItself() {
        const head = this.snakeArray[0];
        for (let i = 1; i < this.snakeArray.length; i++) {
            if (head.x === this.snakeArray[i].x && head.y === this.snakeArray[i].y) {
                return true;
            }
        }
        return false;
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.snakeArray.forEach(segment => {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        });
    }
}

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
        this.isYellow = false;
        this.timer = 60;
    }

    spawn() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    }

    spawnYellow() {
        this.isYellow = true;
        this.timer = 60; // reset the timer
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    }

    draw() {
        ctx.fillStyle = this.isYellow ? 'yellow' : 'red';
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    }
}

function gameLoop() {
    snake.move();
    if (snake.collidesWithWalls() || snake.collidesWithItself()) {
        clearInterval(interval);
        alert('Game Over!');
        return;
    }

    if (snake.snakeArray[0].x === food.x && snake.snakeArray[0].y === food.y) {
        score++;
        if (food.isYellow) {
            score += 49; // additional points for yellow food
            foodYellow = false;
        }
        food.spawn();
        snake.grow();
    }

    if (score % 10 === 0 && !foodYellow) {
        foodYellow = true;
        food.spawnYellow();
    }

    if (foodYellow && food.timer > 0) {
        food.timer--;
    } else if (foodYellow && food.timer <= 0) {
        foodYellow = false;
        food.spawn();
    }

    food.draw();
    snake.draw();
    scoreElement.textContent = score;
    timerElement.textContent = foodYellow ? food.timer : '60';
}

function startGame() {
    snake = new Snake();
    food = new Food();
    score = 0;
    foodYellow = false;
    yellowFoodTimer = 60;
    interval = setInterval(gameLoop, 100);
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
}

function restartGame() {
    startGame();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
window.addEventListener('keydown', event => snake.changeDirection(event));
