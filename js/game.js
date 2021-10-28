// initialize canvas 
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// initialize grid
const TILE_SIZE = 40;
const m = canvas.width / TILE_SIZE;
const n = canvas.height / TILE_SIZE;
const grid = new Array(m);
for (let i = 0; i < m; i++) {
    grid[i] = new Array(n).fill(0);
}

// handle controls
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
    if (snake.dir != dirs.right && (event.key == "a" || event.key == "ArrowLeft")) {
        snake.dir = dirs.left;
    } else if (snake.dir != dirs.left && (event.key == "d" || event.key == "ArrowRight")) {
        snake.dir = dirs.right;
    } else if (snake.dir != dirs.down && (event.key == "w" || event.key == "ArrowUp")) {
        snake.dir = dirs.up;
    } else if (snake.dir != dirs.up && (event.key == "s" || event.key == "ArrowDown")) {
        snake.dir = dirs.down;
    }
}
function followCycle() {
    let sx = snake.body[0][0];
    let sy = snake.body[0][1];
    snake.dir = cycle[sx][sy];
}

// calculate hamiltonian cycle
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
        for (let dir in dirs) {
            let x1 = x + dirs[dir][0];
            let y1 = y + dirs[dir][1];
            if (x1 == 0 && y1 == 0) {
                cycle[x][y] = dirs[dir];
                return true;
            }
        }
        return false;
    }
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
    body: [[Math.floor(m / 2), Math.floor(n / 2)], [Math.floor(m / 2), Math.floor(n / 2 + 1)]],
    dir: dirs.up
};
for (let i = 0; i < snake.body.length; i++) {
    grid[snake.body[i][0]][snake.body[i][1]] = 2;
}

// initialize apple
const apple = {
    x: Math.floor(Math.random() * m),
    y: Math.floor(Math.random() * n)
}
grid[apple.x][apple.y] = 1;

// GAME LOGIC

function moveSnake() {
    if(snake.body.length >= m * n) {
        alert("YOU WIN!");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
        console.log("WIN!");
        return;
    }
    let newHead = [];
    let dir = [snake.dir[0], snake.dir[1]];
    newHead[0] = snake.body[0][0] + dir[0];
    newHead[1] = snake.body[0][1] + dir[1];
    if (newHead[0] < 0 || newHead[0] >= m || newHead[1] < 0 || newHead[1] >= n) {
        alert("GAME OVER!\nYou crashed into the wall.");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
        console.log("OUT");
        return;
    } else if (newHead[0] == apple.x && newHead[1] == apple.y) {
        eatApple();
        console.log("YUM");
    } else if (grid[newHead[0]][newHead[1]] == 2) {
        alert("GAME OVER!\nYou crashed into your own tail.");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
        console.log("HIT");
        return;
    }
    snake.body.unshift(newHead);
    let oldTail = snake.body.pop();
    grid[oldTail[0]][oldTail[1]] = 0;
    grid[newHead[0]][newHead[1]] = 2;
}

function eatApple() {
    let xa = Math.floor(Math.random() * m);
    let ya = Math.floor(Math.random() * n);
    while (grid[xa][ya] != 0) {
        xa = Math.floor(Math.random() * m)
        ya = Math.floor(Math.random() * n)
    }
    apple.x = xa;
    apple.y = ya;
    grid[apple.x][apple.y] = 1;
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
    if(humanPlaying) {
        handleInput();
    } else {
        followCycle();
    }
    moveSnake(); 
    draw();
}

// BUTTON LOGIC
function playComputer() {
    //document.location.reload();
    humanPlaying = false;
    findCycle(0, 0, 0);
    interval = setInterval(play, GAME_SPEED);
}

function playHuman() {
    //document.location.reload();
    clearInterval(interval);
    humanPlaying = true;
    interval = setInterval(play, GAME_SPEED);
}

ctx.font = '1em serif';
ctx.fillText("Press play button to start!", 40, 90);