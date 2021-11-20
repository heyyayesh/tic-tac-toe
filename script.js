const welcomePageModule = (function(){
    const welcomePage = document.getElementById('welcomePage');
    const playAgainstElem = document.getElementById('playAgainst');
    const yourSignElem = document.getElementById('yourSign');
    const startGameBtn = document.getElementById('startGameBtn');
    let playAgainst = 'friend', yourSign = 'x';

    startGameBtn.addEventListener('click', () => {
        playAgainst = playAgainstElem.value;
        yourSign = yourSignElem.value;
        welcomePage.classList.remove('show');
    });

    const getOpponent= () => playAgainst;
    const getSign = () => yourSign;

    return{
        getOpponent,
        getSign,
    }
})();

const playerFactory = function(sign){
    const playerSign = sign;
    const getPlayerSign = () => playerSign;
    return{
        getPlayerSign,
    }
}

const gameBoardModule = (function(){
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    const boxes = document.querySelectorAll('[data-index]');

    boxes.forEach(box => {
        box.addEventListener('click', (e) => {
            gamePlay.updateTurnCount();
            if(gamePlay.getTurnCount() > 9) return;
            let currentSign = (gamePlay.getTurnCount() % 2 !== 0) ? gamePlay.p1.getPlayerSign() : gamePlay.p2.getPlayerSign();
            if(getGameBoard()[parseInt(e.target.dataset.index)] !== '') return;
            getGameBoard()[parseInt(e.target.dataset.index)] = currentSign;
            renderBoard(getGameBoard());
            winningCombinations();
            gamePlay.gameOver();
            
        });
    });

    const winningCombinations = () => {
        return [
        [getGameBoard()[0], getGameBoard()[1], getGameBoard()[2]],
        [getGameBoard()[3], getGameBoard()[4], getGameBoard()[5]],
        [getGameBoard()[6], getGameBoard()[7], getGameBoard()[8]],
        [getGameBoard()[0], getGameBoard()[3], getGameBoard()[6]],
        [getGameBoard()[1], getGameBoard()[4], getGameBoard()[7]],
        [getGameBoard()[2], getGameBoard()[5], getGameBoard()[8]],
        [getGameBoard()[0], getGameBoard()[4], getGameBoard()[8]],
        [getGameBoard()[2], getGameBoard()[4], getGameBoard()[6]],
    ]}

    const renderBoard = (gameBoard) => {
        for(let i = 0; i < 9; i++){
            if(gameBoard[i] === 'x') boxes[i].classList.add('x');
            else if(gameBoard[i] === 'o') boxes[i].classList.add('o');
            else if(gameBoard[i] == ''){
                boxes[i].classList.remove('x');
                boxes[i].classList.remove('o');
            }
        }
    }

    const setGameBoard = (str) => {
        for(let i = 0; i < 9; i++){
            gameBoard[i] = str;
        }
    }

    const getGameBoard = () => gameBoard;

    return{
        renderBoard,
        getGameBoard,
        setGameBoard,
        winningCombinations,
        boxes,
    }
})();

const gamePlay = (function(){
    const p1 = playerFactory(welcomePageModule.getSign());
    const p2 = playerFactory((p1.getPlayerSign() == 'x') ? 'o' : 'x');
    let turnCount = 0;
    const getTurnCount = () => turnCount;
    const resetTurnCount = function(){ turnCount = 0 }
    const updateTurnCount = () => { turnCount++ }

    const isX = (element) => element.every(elem => elem == 'x');
    const isO = (element) => element.every(elem => elem == 'o');

    
    const checkWinner = () => {
        let isW, w;
        isW = gameBoardModule.winningCombinations().some(element => {
            return (isX(element) || isO(element));
        });

        gameBoardModule.winningCombinations().some(element => {
            if(isX(element)) w = 'X';
            else if(isO(element)) w = 'O';
        })
        
        return [isW, w];
    }

    const checkDraw = () => {
        let isFilled = () => {
            return gameBoardModule.getGameBoard().every(element => element == 'x' || element == 'o')
        }
        return isFilled() && !checkWinner()[0];
    }

    const gameOverPage = document.querySelector('.game-over-page');
    const gameOverText = document.getElementById('gameOverText');

    const gameOver = () => {
        if(checkDraw() || checkWinner()[0]){
            gameOverPage.classList.add('show');
            if(checkDraw()){
                gameOverText.textContent = `It's a Tie!`;
            }
            else if(checkWinner()){
                gameOverText.textContent = ` ${checkWinner()[1]} Wins!`;
            }
        }
    }

    const restartBtnList = document.querySelectorAll('.restart-btn');
    
    const restartGame = function(){
        resetTurnCount();
        gameOverPage.classList.remove('show');
        gameOverText.textContent = '';
        gameBoardModule.setGameBoard('');
        gameBoardModule.renderBoard(gameBoardModule.getGameBoard());
    }
    
    restartBtnList.forEach(btn => {
        btn.addEventListener('click', restartGame);
    });

    return{
        p1,
        p2,
        updateTurnCount,
        getTurnCount,
        gameOver,
    }
})();