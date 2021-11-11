// initialize canvas 
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// initialize grid
const TILE_SIZE = 80;
const m = canvas.width / TILE_SIZE;
const n = canvas.height / TILE_SIZE;
const grid = new Array(m);
for (let i = 0; i < m; i++) {
    grid[i] = new Array(n).fill(0);
}

// handle swipes for mobile (https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm)
canvas.addEventListener("touchstart", startTouch, false);
canvas.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    e.preventDefault();
};

function moveTouch(e) {
    if (moveQueue.length >= 2) {
        return;
    }

    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        if (diffX > 0) {
            // swiped left
            moveQueue.push("left");
            console.log("swiped left");
        } else {
            // swiped right
            moveQueue.push("right");
            console.log("swiped right");
        }
    } else {
        // sliding vertically
        if (diffY > 0) {
            // swiped up
            moveQueue.push("up");
            console.log("swiped up");
        } else {
            // swiped down
            moveQueue.push("down");
            console.log("swiped down");
        }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
};

// handle controls
var playerPlaying = false;
var humanPlaying = true;
var interval = 0;
const dirs = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
}
var moveQueue = []
document.addEventListener("keydown", function (event) {
    if (playerPlaying) {
        event.preventDefault();
    }
    if (moveQueue.length >= 2) {
        return;
    }
    moveQueue.push(event);
});
function handleInput() {
    if (moveQueue.length == 0) {
        return;
    }
    let event = moveQueue.shift();
    console.log(event);
    if (snake.dir != dirs.right && (event == "left" || event.key == "a" || event.key == "ArrowLeft")) {
        snake.dir = dirs.left;
    } else if (snake.dir != dirs.left && (event == "right" || event.key == "d" || event.key == "ArrowRight")) {
        snake.dir = dirs.right;
    } else if (snake.dir != dirs.down && (event == "up" || event.key == "w" || event.key == "ArrowUp")) {
        snake.dir = dirs.up;
    } else if (snake.dir != dirs.up && (event == "down" || event.key == "s" || event.key == "ArrowDown")) {
        snake.dir = dirs.down;
    }
}
function followCycle() {
    let sx = snake.body[0][0];
    let sy = snake.body[0][1];
    snake.dir = cycle[sx][sy];
}

// calculate hamiltonian cycle
// create array to store which direction to move at each step
const cycle = new Array(m);
for (let i = 0; i < m; i++) {
    cycle[i] = new Array(n).fill(0);
}
function isValid(x, y) {
    if (x < 0 || x >= m || y < 0 || y >= n) {
        return false;
    }
    return cycle[x][y] == 0;
}
function findCycle(x, y, depth) {
    if (depth == m * n - 1) {
        for (let dir in dirs) { // iterate through directions
            // coordinate of adjacent square
            let x1 = x + dirs[dir][0];
            let y1 = y + dirs[dir][1];
            // if every square is visited and there is a path to (0, 0)
            // from the last node then we found a Hamiltonian cycle
            if (x1 == 0 && y1 == 0) {
                cycle[x][y] = dirs[dir];
                return true;
            }
        }
        return false;
    }
    // backtracking
    for (let dir in dirs) {
        let x1 = x + dirs[dir][0];
        let y1 = y + dirs[dir][1];
        if (isValid(x1, y1)) {
            cycle[x][y] = dirs[dir];
            if (findCycle(x1, y1, depth + 1)) {
                return true;
            }
            cycle[x][y] = 0;
        }
    }
    return false;
}

// initialize snake
const snake = {
    body: [[m - 2, n - 1], [m - 1, n - 1]],
    dir: dirs.up
};
for (let i = 0; i < snake.body.length; i++) {
    grid[snake.body[i][0]][snake.body[i][1]] = 2;
}

// initialize apple
const apple = {
    x: 1,
    y: 1
}
grid[apple.x][apple.y] = 1;

// GAME LOGIC

function moveSnake() {
    if (snake.body.length >= m * n) {
        console.log("WIN!");
        return 1;
    }
    // generate new square in front of snake in direction of movement
    let newHead = [];
    let dir = [snake.dir[0], snake.dir[1]];
    newHead[0] = snake.body[0][0] + dir[0];
    newHead[1] = snake.body[0][1] + dir[1];
    if (newHead[0] < 0 || newHead[0] >= m || newHead[1] < 0 || newHead[1] >= n) {
        console.log("OUT");
        return 2;
    } else if (newHead[0] == apple.x && newHead[1] == apple.y) {
        eatApple();
        console.log("YUM");
    } else if (grid[newHead[0]][newHead[1]] == 2) {
        console.log("HIT");
        return 2;
    }
    // add new square to front and delete oldest square from back  
    snake.body.unshift(newHead);
    let oldTail = snake.body.pop();
    grid[oldTail[0]][oldTail[1]] = 0;
    grid[newHead[0]][newHead[1]] = 2;
    return 0;
}

function getEmpty() {
    let empty = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 0) {
                empty.push([i, j]);
            }
        }
    }
    return empty[Math.floor(Math.random() * empty.length)];
}

function eatApple() {
    let square = getEmpty();
    grid[apple.x][apple.y] = 0;
    let xa = square[0];
    let ya = square[1];
    apple.x = xa;
    apple.y = ya;
    grid[apple.x][apple.y] = 1;
    // grow new tail segment in opposite direction of previous tail
    let oldTail = snake.body[snake.body.length - 1];
    let olderTail = snake.body[snake.body.length - 2];
    let tailDir = [olderTail[0] - oldTail[0], olderTail[1] - oldTail[1]];
    let xs = oldTail[0] + tailDir[0];
    let ys = oldTail[1] + tailDir[1];
    snake.body.push([xs, ys]);
}

// DRAW LOGIC

function drawApple() {
    ctx.beginPath();
    ctx.rect(apple.x * TILE_SIZE, apple.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawSnake() {
    ctx.beginPath();
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.body.length; i++) {
        let x = snake.body[i][0], y = snake.body[i][1];
        ctx.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.fill();
    }
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawApple();
    drawSnake();
}

// MAIN GAME LOOP

const GAME_SPEED = 150;
function play() {
    if (humanPlaying) {
        handleInput();
    } else {
        followCycle();
    }
    let state = moveSnake();
    if (state == 0) {
        draw();
    } else if (state == 1) {
        clearInterval(interval);
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.font = 'bold 2em serif';
        let textString = "YOU WIN!";
        let textWidth = ctx.measureText(textString).width
        ctx.fillText(textString, (canvas.width - textWidth) / 2, canvas.height / 2.5);
        playerPlaying = false;
    } else if (state == 2) {
        clearInterval(interval);
        ctx.beginPath();
        ctx.fillStyle = "orange";
        ctx.font = 'bold 2em serif';
        let textString = "GAME OVER!";
        let textWidth = ctx.measureText(textString).width
        ctx.fillText(textString, (canvas.width - textWidth) / 2, canvas.height / 2.5);
        ctx.closePath();
        playerPlaying = false;
    }
}

// BUTTON LOGIC
document.addEventListener("DOMContentLoaded", function () {
    let myOffcanvas = document.getElementById("sidebar");
    if (myOffcanvas != null) {
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        document.getElementById("open-menu").addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            bsOffcanvas.toggle();
        });
    }
});

var playButton = document.getElementById("play");
var playButtonDisplay = playButton.style.display;
var stopButton = document.getElementById("reset");
function playComputer() {
    humanPlaying = false;
    interval = setInterval(play, GAME_SPEED);
    playButton.style.display = "none";
    stopButton.style.display = "block";
}

function playHuman() {
    clearInterval(interval);
    humanPlaying = true;
    interval = setInterval(play, GAME_SPEED);
    playButton.style.display = "none";
    stopButton.style.display = "block";
    playerPlaying = true;
}

function resetGame() {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            grid[i][j] = 0;
        }
    }
    let square = getEmpty();
    apple.x = square[0];
    apple.y = square[1];
    grid[apple.x][apple.y] = 1;
    snake.body = [[Math.floor(m / 2), Math.floor(n / 2)], [Math.floor(m / 2), Math.floor(n / 2 + 1)]];
    snake.dir = dirs.up;
    for (let i = 0; i < snake.body.length; i++) {
        grid[snake.body[i][0]][snake.body[i][1]] = 2;
    }
    ctx.fillStyle = "black";
    ctx.font = '2em serif';
    let textString = "Press play button to start!";
    let textWidth = ctx.measureText(textString).width
    ctx.fillText(textString, (canvas.width - textWidth) / 2, 90);
    playButton.style.display = playButtonDisplay;
    stopButton.style.display = "none";
}

findCycle(0, 0, 0);
resetGame();