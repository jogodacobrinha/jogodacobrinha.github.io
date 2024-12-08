const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-btn");

const gridSize = 20;  // Tamanho das células do grid
const tileCount = 20; // Número de células em cada linha e coluna
canvas.width = gridSize * tileCount;
canvas.height = gridSize * tileCount;

let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
]; // Posição inicial da cobra
let direction = "right"; // Direção inicial
let food = { x: 8, y: 8 }; // Posição inicial da comida
let score = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime"; // Cabeça da cobra é verde
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Desenhar a comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Mostrar a pontuação
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function update() {
    // Mover a cobra
    const head = { ...snake[0] };

    if (direction === "right") head.x++;
    if (direction === "left") head.x--;
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;

    snake.unshift(head);

    // Verificar se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop(); // Remover a cauda se não comeu
    }

    // Verificar colisão com as paredes ou com o próprio corpo
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || isCollidingWithSelf(head)) {
        resetGame();
    }

    draw();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function isCollidingWithSelf(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function resetGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = "right";
    score = 0;
    placeFood();
}

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
}

function gameLoop() {
    update();
    setTimeout(gameLoop, 100);
}

function startGame() {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
}

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);

// Controles para mobile
document.getElementById("up-btn").addEventListener("click", () => {
    if (direction !== "down") direction = "up";
});
document.getElementById("down-btn").addEventListener("click", () => {
    if (direction !== "up") direction = "down";
});
document.getElementById("left-btn").addEventListener("click", () => {
    if (direction !== "right") direction = "left";
});
document.getElementById("right-btn").addEventListener("click", () => {
    if (direction !== "left") direction = "right";
});
