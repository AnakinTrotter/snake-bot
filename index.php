<?php

/**
 *  Given a file, i.e. /css/base.css, replaces it with a string containing the
 *  file's mtime, i.e. /css/base.1221534296.css.
 * 
 *  https://stackoverflow.com/questions/118884/how-to-force-the-browser-to-reload-cached-css-and-javascript-files
 *
 *  @param $file  The file to be loaded.  Must be an absolute path (i.e.
 *                starting with slash).
 */
function auto_version($file)
{
    if (strpos($file, '/') !== 0 || !file_exists($_SERVER['DOCUMENT_ROOT'] . $file))
        return $file;

    $mtime = filemtime($_SERVER['DOCUMENT_ROOT'] . $file);
    return preg_replace('{\\.([^./]+)$}', ".$mtime.\$1", $file);
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Snake Bot</title>
    <link rel="icon" href="img/icon.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo auto_version('css/main.css'); ?>">
</head>

<body>
    <section class="container-fluid bg-light">
        <h1 class="display-1 text-center text-primary">Snake Bot</h1>
        <h3 class="h3 text-center text-secondary">By: Anakin Trotter</h3>
        <a href="#sidebar" id="open-menu" class="d-block mt-3 text-center fw-bold h4" role="button">Table of
            Contents</a>
    </section>
    <div class="container-md">
        <section id="about-the-game">
            <h2>About the Game</h2>
            <p>The snake game genre originated in 1976 with the game <i>Blockade</i> by Gremlin Industries. The
                objective
                of snake is to grow the snake as long as possible. Eating the apple will cause the snake to grow.
                Crashing
                into the wall or the snake's own tail will result in a game over. In the demo I have created below, the
                green squares make up the snake and the red square is the apple. Click "Play as Human" and use the arrow
                keys or WASD to control the snake. For mobile users, swipe the game board in the desired direction of movement.
                Alternatively, click "Play as Computer" to see the winning strategy.
            </p>
            <div>
                <canvas id="myCanvas" width="480" height="480"></canvas>
                <div class="text-center">
                    <div class="btn-group" id="play">
                        <button class="btn btn-lg btn-primary" type="button" onclick="playHuman()">Play as Human</button>
                        <button class="btn btn-lg btn-secondary" type="button" onclick="playComputer()">Play as
                            Computer</button>
                    </div>
                    <div id="reset">
                        <button class="btn btn-lg btn-primary" type="button" onclick="resetGame()">Reset</button>
                    </div>
                </div>
            </div>
        </section>
        <section id="hamiltonian-cycles">
            <h2>Hamiltonian Cycles</h2>
            <p>If you watched the computer play, you would have seen that it repeatedly follows the same path until it
                wins.
                The type of path that the snake bot follows is called a Hamiltonian cycle. In graph theory, a
                Hamiltonian
                cycle is defined as a closed loop through a graph that visits each vertex exactly once before returning
                to
                the starting node.</p>
            <img alt="An undirected graph that contains a Hamiltonian cycle." src="img/cycle.png" />
            <img alt="An undirected graph that contains an articulation point and no Hamiltonian cycle." src="img/articulation.png" />
            <img alt="An undirected graph that contains a pendant and no Hamiltonian cycle." src="img/pendant.png" />
            <p>For example, in figure 1, the paths through nodes 1, 2, 3, 4, 5, 1 and 3, 4, 5, 2, 1, 3 are Hamiltonian
                cycles
                because each vertex is visited one time, and the paths have the same starting and ending node.
                Evidently,
                graphs may contain multiple Hamiltonian cycles. Also, notice that traversing every edge is not a
                condition
                of a Hamiltonian cycle. On the contrary, figures 2 has no possible Hamiltonian cycles because any cycle
                would have to visit node 3 at least twice. Node 3 is also an example of a special type of vertex called
                an
                articulation point. Articulation points, or cut vertices, are vertices that if removed, would cause the
                graph to become disconnected. Moving on, figure 3 also has no Hamiltonian cycles because it contains
                pendant or leaf nodes, namely nodes 5 and 6. A leaf node is a vertex of degree 1, or a vertex with
                exactly 1
                edge.
            </p>
            <img alt="A Hamiltonian path starting from the top left on a 6x6 grid." src="img/6x6.png" />
            <p>
                Applying the concept of Hamiltonian cycles to snake, we can treat the game like a grid graph, where
                each square in the game represents a vertex and each vertex has bidirectional edges leading to all
                adjacent
                vertices. We can then generate a Hamiltonian cycle through the grid, as shown in the picture above.
                Assuming
                satisfactory reaction time such that the snake never hits the wall, the only way to lose
                is if the snake hits its own tail. Given that the snake's tail follows the path of the head, for a snake
                of
                length n, the tail segments can always be found along the path that the snake's head traced over the
                past
                n - 1 moves. Therefore, as long as n is less than or equal to the total number of squares in the grid,
                the
                snake will never have to hit its own tail, and can essentially "chase" its own tail to victory.
            </p>
        </section>
        <section id="implementation">
            <h2>Implementation</h2>
            <p>For simplicity, my program only tries to find 1 Hamiltonian cycle starting from the top left
                square. The code is written in Javascript so that it can run in the browser. The algorithm I used is
                called
                backtracking. I also utilized 2D arrays and custom objects.</p>
            <a href="https://github.com/AnakinTrotter/snake-ai" target="_blank">Link to GitHub repository</a>
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
        <section id="references">
            <h2>References</h2>
            <div id="ref-links">
                <a href="https://www.youtube.com/watch?v=dQr4wZCiJJ4&t=268s" target="__blank">https://www.youtube.com/watch?v=dQr4wZCiJJ4&t=268s</a>
                <a href="https://math.stackexchange.com/questions/1699203/hamilton-paths-cycles-in-grid-graphs/1699220#1699220" target="_blank">https://math.stackexchange.com/questions/1699203/hamilton-paths-cycles-in-grid-graphs/1699220#1699220</a>
                <a href="https://www.geeksforgeeks.org/proof-that-hamiltonian-cycle-is-np-complete/" target="_blank">https://www.geeksforgeeks.org/proof-that-hamiltonian-cycle-is-np-complete/</a>
                <a href="https://en.wikipedia.org/wiki/Hamiltonian_path" target="_blank">https://en.wikipedia.org/wiki/Hamiltonian_path</a>
            </div>
        </section>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="sidebar" aria-labelledby="sidebar-label">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="sidebar-label">Table of Contents</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="class offcanvas-body">
                <ol>
                    <li>
                        <a href="#about-the-game">About the Game</a>
                    </li>
                    <li>
                        <a href="#hamiltonian-cycles">Hamiltonian Cycles</a>
                    </li>
                    <li>
                        <a href="#implementation">Implementation</a>
                    </li>
                    <li>
                        <a href="#references">References</a>
                    </li>
                </ol>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        <script src="<?php echo auto_version('js/game.js'); ?>"></script>
</body>
</div>

</html>