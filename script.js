// Configuração inicial do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let score = 0;
let snake, food, dx, dy, gameOver;

// Botões de controle
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

// Função para gerar a comida em posição aleatória
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food = { x, y };
}

// Função para desenhar a cobra e a comida
function drawGame() {
    if (gameOver) return;

    // Atualiza a posição da cobra
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verifica colisão com as paredes
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || isCollisionWithBody(head)) {
        gameOver = true;
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", 120, canvasSize / 2);
        restartButton.style.display = "inline-block";  // Mostra o botão de reiniciar
        return;
    }

    snake.unshift(head); // Adiciona a nova cabeça à frente da cobra

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood(); // Gera uma nova comida
    } else {
        snake.pop(); // Remove a última parte da cobra
    }

    // Limpa o canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Desenha a borda limitadora (linha onde a cobra pode chegar)
    ctx.strokeStyle = "#fff"; // Cor da linha
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasSize - 1, 0);
    ctx.lineTo(canvasSize - 1, canvasSize);
    ctx.stroke();

    // Desenha a cobra
    ctx.fillStyle = "#00FF00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Desenha a comida
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Atualiza o placar
    document.getElementById("score").textContent = `Pontuação: ${score}`;

    setTimeout(drawGame, 100); // Atualiza o jogo a cada 100ms
}

// Verifica se a cobra colidiu com seu próprio corpo
function isCollisionWithBody(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Função para controlar os movimentos da cobra
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

// Função para iniciar o jogo
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
    generateFood();
    restartButton.style.display = "none";  // Esconde o botão de reiniciar
    startButton.style.display = "none";   // Esconde o botão de iniciar
    drawGame();
}

// Função para reiniciar o jogo
function restartGame() {
    startGame();
}

// Eventos para os botões
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

// Inicia o jogo ao pressionar uma tecla
document.addEventListener("keydown", changeDirection);
