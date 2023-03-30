const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".New-game-btn");

let currentPlayer;
let gameGrid;
let stop_flag = false;


const scores = {
    X: -10, // minimizing player
    O: 10, // maximizing player
    tie: 0,
};

const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]; // ; is important

function initGame() {
    currentPlayer = "X";
    gameGrid = ["", "", "", "", "", "", "", "", ""];
    boxes.forEach((box, index) => {
        box.innerText = "";

        // remove current won cells green color
        box.classList = `box box${index + 1}`;
        // boxes[index].classList=`box box${index+1}`;

        // enabling pointer events
        box.style.pointerEvents = "all";
        // boxes[index].style.pointerEvents="all";
    });
    newGameBtn.classList.remove("active");
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
    stop_flag = false;
}

initGame();

function swapTurn() {
    if (currentPlayer === "X") {
        currentPlayer = "O";
    }

    // console.log(currentPlayer);
    checkGameOver();

    if (!stop_flag) {
        // Now integration alpha beta pruning for computer as 'O'
        if (currentPlayer === "O") {
            let bestScore = -Infinity;
            let bestMove;
            for (let i = 0; i < 9; i++) {
                if (gameGrid[i] === "") {
                    gameGrid[i] = currentPlayer;
                    // next turn is for minimizing player i.e human so isMaximizing player is sent as false
                    let score = minimax( gameGrid, 0, false, -Infinity, Infinity );
                    // backtracking
                    gameGrid[i] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            gameGrid[bestMove] = currentPlayer;
            boxes[bestMove].innerText = currentPlayer;
            boxes[bestMove].style.pointerEvents = "none";
            checkGameOver();
            currentPlayer = "X";

            // checking
            // console.log(gameGrid);
        }

        // updating above notification
        gameInfo.innerText = `Current Player - ${currentPlayer}`;
    }
}

function minimax(gameGrid, depth, isMaximizingPlayer, alpha, beta) {

    // checking for win/tie/none of them (utility value)
    let result = checkResult(gameGrid);


    // if result is null then it means there is no win and no tie
    if (result !== null) {
        return scores[result];
    }

    
    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (gameGrid[i] === "") {
                gameGrid[i] = "O";
                let score = minimax(gameGrid, depth + 1, false, alpha, beta);
                gameGrid[i] = "";
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (gameGrid[i] === "") {
                gameGrid[i] = "X";
                let score = minimax(gameGrid, depth + 1, true, alpha, beta);
                gameGrid[i] = "";
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkResult(gameGrid) {
    for (let i = 0; i < winningPositions.length; i++) {
        const [a, b, c] = winningPositions[i];
        if ( gameGrid[a] !== "" && gameGrid[a] === gameGrid[b] && gameGrid[a] === gameGrid[c] ) {
            return gameGrid[a];
        }
    }
    let emptyBoxes = 0;
    for (let i = 0; i < 9; i++) {
        if (gameGrid[i] === "") {
            emptyBoxes++;
        }
    }
    if (emptyBoxes === 0) {
        return "tie";
    }
    return null;
}



// automation completed

function handleClick(index) {
    if (gameGrid[index] === "") {
        // modifying gameGrid
        gameGrid[index] = currentPlayer;
        // modifying
        boxes[index].innerText = currentPlayer;
        boxes[index].style.pointerEvents = "none";
        swapTurn();
        checkGameOver();
        
        // checking
        // console.log(gameGrid);
    }
}

function checkGameOver() {
    let winner = "";
    winningPositions.forEach((pos) => {
        if ( gameGrid[pos[0]] !== "" && gameGrid[pos[0]] === gameGrid[pos[1]] && gameGrid[pos[0]] === gameGrid[pos[2]]
        ) {
            // winner=boxes[pos[0]].innerText;
            winner = gameGrid[pos[0]];
            // Winning box color change
            boxes[pos[0]].classList.add("win");
            boxes[pos[1]].classList.add("win");
            boxes[pos[2]].classList.add("win");

            // Disabling pointer events for stopping the game
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            });
        }
    });

    if (winner !== "") {
        gameInfo.innerText = `Winner - ${winner}`;
        newGameBtn.classList.add("active");
        return; // for avoiding unnecessary code check below
    }

    let count = 0;
    boxes.forEach((box) => {
        if (box.innerText !== "") {
            count++;
        }
    });

    if (count == 9) {
        gameInfo.innerText = `Game Tied !`;
        newGameBtn.classList.add("active");
        // To stop further alpha beta pruning process
        stop_flag = true;
    }
}

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        handleClick(index);
    });
});

newGameBtn.addEventListener("click", initGame);
