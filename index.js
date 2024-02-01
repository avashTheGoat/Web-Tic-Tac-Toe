const Player = Object.freeze({
    X: 0, O: 1
});

const GameState = Object.freeze({
    ONGOING: 0, DRAW: 1,
    LOSS_X: 2, LOSS_O: 3
});

let curPlayer = Player.X;
let gameState = GameState.ONGOING;

const ticTacToeSquares = document.getElementsByClassName("tic-tac-toe-square");
const boardState = [["NONE", "NONE", "NONE"],
                    ["NONE", "NONE", "NONE"],
                    ["NONE", "NONE", "NONE"]];

const xImage = document.getElementById("x-image");
const oImage = document.getElementById("o-image");

const resetButton = document.getElementById("reset-button");

addEventListener("mousedown", _event => {
    if (gameState != GameState.ONGOING) return;

    const _clickedElement = document.elementFromPoint(_event.clientX, _event.clientY);

    const [_squareIndex, _isValidSquare] = isElementValidSquare(_clickedElement);
    
    if (!_isValidSquare) return;

    boardState[Math.floor(_squareIndex / 3)][_squareIndex % 3] = curPlayer == Player.X ? "X" : "O";

    placeXOrOAtSquare(_clickedElement);

    gameState = getGameState();

    if (gameState == GameState.LOSS_O || gameState == GameState.LOSS_X) {
        alert((curPlayer == Player.X ? "X" : "O") + " won!");
    }

    else if (gameState == GameState.DRAW) {
        alert("It's a draw");
    }

    else {
        curPlayer = curPlayer == Player.X ? Player.O : Player.X;
    }
});

resetButton.onclick = () => {
    curPlayer = Player.X;
    gameState = GameState.ONGOING;

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            boardState[row][column] = "NONE";
        }
    }

    for (const _ticTacToeSquare of ticTacToeSquares) {
        _ticTacToeSquare.innerHTML = "";
    }
};

function placeXOrOAtSquare(_clickedElement) {
    const _image = curPlayer == Player.X ? xImage.cloneNode(true) : oImage.cloneNode(true);
    _image.style.display = "inline";
    _clickedElement.appendChild(_image);
}

function isElementValidSquare(_element) {
    if (_element == null) return [-1, false];

    let _isGameSquare = false;
    let _index = 0;
    for (; _index < ticTacToeSquares.length; _index++) {
        if (_element == ticTacToeSquares[_index]) {
            _isGameSquare = true;
            break;
        }
    }

    if (!_isGameSquare) return [-1, false];

    if (boardState[Math.floor(_index / 3)][_index % 3] != "NONE") return [-1, false];
    
    return [_index, true];
}

function getGameState() {
    if (didPlayerWin(Player.X)) return GameState.LOSS_O;
    if (didPlayerWin(Player.O)) return GameState.LOSS_X;

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] === "NONE") return GameState.ONGOING;
        }
    }

    return GameState.DRAW;
}

function didPlayerWin(_player) {
    let _playerString = _player == Player.X ? "X" : "O";

    // checking each row
    for (let row = 0; row < 3; row++) {
        let _numInRow = 0;
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] === _playerString) _numInRow++;
        }

        if (_numInRow == 3) return true;
    }

    // checking each column
    for (let column = 0; column < 3; column++) {
        let _numInColumn = 0;
        for (let row = 0; row < 3; row++) {
            if (boardState[row][column] === _playerString) _numInColumn++;
        }

        if (_numInColumn == 3) return true;
    }

    // checking diagonal from top left to bottom right
    let _numInDiagonal = 0;
    for (let i = 0; i < 3; i++) {
        if (boardState[i][i] == _playerString) _numInDiagonal++;
    }

    if (_numInDiagonal == 3) return true;

    // checking diagonal from bottom left to top right
    _numInDiagonal = 0;
    for (let i = 0; i < 3; i++) {
        if (boardState[2 - i][i] == _playerString) _numInDiagonal++;
    }

    if (_numInDiagonal == 3) return true;

    return false;
}