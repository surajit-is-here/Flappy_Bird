let gameStarted = false;
let gameOver = false;
let pipeInterval = null;


// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdimg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

// Physics
let vx = -6;
let vy = 0;
let gravity = 0.4;

let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdimg = new Image();
    birdimg.src = "./flappybird.png";

    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";

    document.getElementById("startBtn").addEventListener("click", startGame);
    document.addEventListener("keydown", moveBird);

    drawStartScreen();
    requestAnimationFrame(update); 
};

// ================= START SCREEN =================
function drawStartScreen() {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "28px sans-serif";
    context.fillText("Click Start Button to Play", 25, boardHeight / 2);
}

// ================= GAME LOOP =================
function update() {
    requestAnimationFrame(update);

    if (!gameStarted) return;

    context.clearRect(0, 0, board.width, board.height);

    // Bird
    vy += gravity;
    bird.y += vy;
    bird.y = Math.max(bird.y, 0);

    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        endGame();
        return;
    }

    // Pipes
    for (let pipe of pipeArray) {
        pipe.x += vx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            endGame();
            return;
        }
    }

    while (pipeArray.length && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

// ================= PIPE SPAWN =================
function placePipes() {
    if (!gameStarted) return;

    let randomY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = pipeHeight / 4;

    pipeArray.push({
        img: topPipeImage,
        x: pipeX,
        y: randomY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    });

    pipeArray.push({
        img: bottomPipeImage,
        x: pipeX,
        y: randomY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    });
}

// ================= INPUT =================
function moveBird(e) {
    if (!gameStarted || gameOver) return;

    if (e.code === "Space" || e.code === "ArrowUp") {
        vy = -6;
    }
}

// ================= GAME CONTROL =================
function startGame() {
    console.log("Game started");
    clearInterval(pipeInterval);

    gameStarted = true;
    gameOver = false;
    score = 0;
    vy = 0;
    bird.y = birdY;
    pipeArray = [];

    pipeInterval = setInterval(placePipes, 3000);
}

function endGame() {
    gameStarted = false;
    gameOver = true;
    clearInterval(pipeInterval);

    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.fillText("Game Over", 90, boardHeight / 2);
}

// ================= COLLISION =================
function detectCollision(a, b) {
    return (
        a.x + a.width > b.x &&
        b.x + b.width > a.x &&
        a.y + a.height > b.y &&
        b.y + b.height > a.y
    );
}
