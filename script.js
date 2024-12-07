const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let score = 0;
let snake, redFood, yellowFood, dx, dy, gameOver;
let redFoodCount = 0;
let yellowFoodTimer;

// Botões de controle
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const controlButtons = document.querySelectorAll(".control-btn");

function generateFood(type) {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

    if (type === "red") {
        redFood = { x, y };
    } else if (type === "yellow") {
        yellowFood = { x, y };
        clearTimeout(yellowFoodTimer);
        yellowFoodTimer = setTimeout(() => {
            yellowFood = null;
        }, 60000); // Desaparece após 1 minuto
    }
}

function drawGame() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || isCollisionWithBody(head)) {
        gameOver = true;
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", 120, canvasSize / 2);
        restartButton.style.display = "inline-block";
        return;
    }

    snake.unshift(head);

    if (head.x === redFood.x && head.y === redFood.y) {
        score += 1;
        redFoodCount++;
        generateFood("red");
        if (redFoodCount === 10) {
            generateFood("yellow");
            redFoodCount = 0;
        }
    } else if (yellowFood && head.x === yellowFood.x && head.y === yellowFood.y) {
        score += 50;
        yellowFood = null;
    } else {
        snake.pop();
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "#00FF00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(redFood.x, redFood.y, gridSize, gridSize);

    if (yellowFood) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(yellowFood.x, yellowFood.y, gridSize, gridSize);
    }

    document.getElementById("score").textContent = `Pontuação: ${score}`;
    setTimeout(drawGame, 100);
}

function isCollisionWithBody(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function changeDirection(event) {
    if (event.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -gridSize;
    }
    if (event.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
    if (event.key === "ArrowLeft" && dx === 0) {
        dx = -gridSize;
        dy = 0;
    }
    if (event.key === "ArrowRight" && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
}

function handleMobileControls() {
    controlButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const dir = btn.getAttribute("data-dir");
            if (dir === "up" && dy === 0) {
                dx = 0;
                dy = -gridSize;
            }
            if (dir === "down" && dy === 0) {
                dx = 0;
                dy = gridSize;
            }
            if (dir === "left" && dx === 0) {
                dx = -gridSize;
                dy = 0;
            }
            if (dir === "right" && dx === 0) {
                dx = gridSize;
                dy = 0;
            }
        });
    });
}

function startGame() {
    score = 0;
    gameOver = false;
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    dx = gridSize;
    dy = 0;
    redFoodCount = 0;
    generateFood("red");
    yellowFood = null;
    clearTimeout(yellowFoodTimer);
    restartButton.style.display = "none";
    startButton.style.display = "none";
    drawGame();
}

function restartGame() {
    startGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
document.addEventListener("keydown", changeDirection);
handleMobileControls();
