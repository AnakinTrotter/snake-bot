<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Snake AI</title>
    <link rel="stylesheet" href="css/main.css">
</head>

<body>
    <section>
        <h1>Snake Bot</h1>
        <h3>By: Anakin Trotter</h3>
    </section>
    <section>
        <h2>About the game</h2>
        <p>The snake game genre originated in 1976 with the game <i>Blockade</i> by Gremlin Industries. The objective
            of snake is to grow the snake as long as possible. Eating the apple will cause the snake to grow. Crashing
            into the wall or the snake's own tail will result in a game over. In the demo I have created below, the
            green squares make up the snake and the red square is the apple. Click "Play as Human" and use the arrow
            keys or WASD to control the snake. Alternatively, click "Play as Computer" to see the winning strategy.</p>
    </section>
    <div>
        <canvas id="myCanvas" width="240" height="240"></canvas>
        <div id="play">
            <button type="button" onclick="playHuman()">Play as Human</button>
            <button type="button" onclick="playComputer()">Play as Computer</button>
        </div>
        <div id="reset">
            <button type="button" onclick="resetGame()">Reset</button>
        </div>
    </div>
    <section>
        <h2>Hamiltonian Cycles</h2>
        <p>If you watched the computer play, you would have seen that it repeatedly follows the same path until it wins.
            The type of path that the snake bot follows is called a Hamiltonian cycle. In graph theory, a Hamiltonian
            cycle is defined as a closed loop through a graph that visits each vertex exactly once before returning to
            the starting node.</p>
        <img src="img/cycle.png" />
        <img src="img/articulation.png" />
        <img src="img/pendant.png" />
        <p>For example, in figure 1, the path through nodes 1, 2, 3, 4, 5, 1 and 3, 4, 5, 2, 1, 3 are Hamiltonian cycles
            because each vertex is visited one time, and the paths have the same starting and ending node. Evidently,
            graphs may contain multiple Hamiltonian cycles. Also, notice that traversing every edge is not a condition
            of a Hamiltonian cycle. On the contrary, figures 2 has no possible Hamiltonian cycles because any cycle
            would have to visit node 3 at least twice. Node 3 is also an example of a special type of vertex called an
            articulation point. Articulation points, or cut vertices, are vertices that if removed, would cause the
            graph to become disconnected. Moving on, figure 3 also has no Hamiltonian cycles because it contains
            pendant or leaf nodes, namely nodes 5 and 6. A leaf node is a vertex of degree 1, or a vertex with exactly 1
            edge.
        </p>
        <img src="img/6x6.png" />
        <p>
            Applying the concept of Hamiltonian cycles to snake, we can treat the game like a grid graph, where
            each square in the game represents a vertex and each vertex has bidirectional edges leading to all adjacent
            vertices. We can then generate a Hamiltonian cycle through the grid, as shown in the picture above. Assuming
            satisfactory reaction time such that the snake never hits the wall, the only way to lose
            is if the snake hits its own tail. Given that the snake's tail follows the path of the head, for a snake of
            length n, the tail segments can always be found along the path that the snake's head traced over the past
            n - 1 moves. Therefore, as long as n is less than or equal to the total number of squares in the grid, the
            snake will never have to hit its own tail, and can essentially "chase" its own tail to victory.
        </p>
    </section>
    <section>
        <h2>Implementation</h2>
        <p>For simplicity, my program only tries to find 1 Hamiltonian cycle starting from the top left
            square. The code is written in Javascript so that it can run in the browser. The algorithm I used is called
            backtracking. I also utilized 2D arrays and custom objects.</p>
        <pre><code>
// init grid size and allowed movement directions
const m = 6, n = 6;
const dirs = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
}

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
        for (let dir in dirs) {
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
        </code></pre>
        <p>Generating a Hamiltonian cycle is an NP-complete problem, which means that the problem can be solved in
            nondeterministic polynomial time.</p>
    </section>
    <section>
        <h2>References</h2>
        <div id="ref-links">
            <a
                href="https://www.youtube.com/watch?v=dQr4wZCiJJ4&t=268s">https://www.youtube.com/watch?v=dQr4wZCiJJ4&t=268s</a>
            <a
                href="https://math.stackexchange.com/questions/1699203/hamilton-paths-cycles-in-grid-graphs/1699220#1699220">https://math.stackexchange.com/questions/1699203/hamilton-paths-cycles-in-grid-graphs/1699220#1699220</a>
            <a
                href="https://www.geeksforgeeks.org/proof-that-hamiltonian-cycle-is-np-complete/">https://www.geeksforgeeks.org/proof-that-hamiltonian-cycle-is-np-complete/</a>
            <a href="https://en.wikipedia.org/wiki/Hamiltonian_path">https://en.wikipedia.org/wiki/Hamiltonian_path</a>
        </div>
    </section>
    <script src="js/game.js"></script>
</body>

</html>