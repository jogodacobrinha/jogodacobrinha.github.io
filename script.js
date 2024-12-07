// Elementos da página
const introScreen = document.querySelector(".intro-screen");
const gameContainer = document.querySelector(".game-container");
const proceedButton = document.getElementById("proceedButton");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");

// Configuração inicial do jogo
const gridSize = 20;
const canvasSize = 400;
let score = 0;
let snake, food, specialFood, dx, dy, gameOver;
let specialFoodTimeout;
let foodCounter = 0;

// Exibe o jogo após clicar em "Jogar"
proceedButton.addEventListener("click", () => {
    introScreen.style.display = "none";
    gameContainer.style.display = "block";
});

// Gera comida em posição aleatória
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Atualiza a pontuação no painel lateral
function updateScore() {
    scoreDisplay.textContent = score;
}

// Desenha o jogo
function drawGame() {
    if (gameOver) return;

    // Atualiza a posição da cobra
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verifica colisão com as paredes ou corpo
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || isCollisionWithBody(head)) {
        gameOver = true;
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", 120, canvasSize / 2);
        restartButton.style.display = "inline-block";
        return;
    }

    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        foodCounter += 1;
        food = generateFood();

        // A cada 10 comidas, gera uma comida especial
        if (foodCounter % 10 === 0) {
            specialFood = generateFood();
            clearTimeout(specialFoodTimeout);
            specialFoodTimeout = setTimeout(() => {
                specialFood = null;
            }, 60000); // 1 minuto para pegar a comida especial
        }
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        score += 50;
        specialFood = null;
        clearTimeout(specialFoodTimeout);
    } else {
        snake.pop(); // Remove a cauda
    }

    // Limpa o canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Desenha a cobra
    ctx.fillStyle = "#00FF00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Desenha a comida normal
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Desenha a comida especial, se existir
    if (specialFood) {
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(specialFood.x, specialFood.y, gridSize, gridSize);
    }

    // Atualiza a pontuação
    updateScore();

    setTimeout(drawGame, 100);
}

// Verifica colisão com o corpo da cobra
function isCollisionWithBody(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Controla a direção da cobra
function changeDirection(event) {
    const direction = event.key || event.target.dataset.dir;

    if (direction === "ArrowUp" || direction === "up") {
        if (dy === 0) {
            dx = 0;
            dy = -gridSize;
        }
    } else if (direction === "ArrowDown" || direction === "down") {
        if (dy === 0) {
            dx = 0;
            dy = gridSize;
        }
    } else if (direction === "ArrowLeft" || direction === "left") {
        if (dx === 0) {
            dx = -gridSize;
            dy = 0;
        }
    } else if (direction === "ArrowRight" || direction === "right") {
        if (dx === 0) {
            dx = gridSize;
            dy = 0;
        }
    }
}

// Inicia o jogo
function startGame() {
    score = 0;
    foodCounter = 0;
    gameOver = false;
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    dx = gridSize;
    dy = 0;
    food = generateFood();
    specialFood = null;
    clearTimeout(specialFoodTimeout);

    restartButton.style.display = "none";
    startButton.style.display = "none";

    updateScore();
    drawGame();
}

// Reinicia o jogo
function restartGame() {
    startGame();
}

// Eventos de controle
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

// Controle de toque para dispositivos móveis
document.querySelectorAll(".control-btn").forEach(button => {
    button.addEventListener("click", changeDirection);
});
