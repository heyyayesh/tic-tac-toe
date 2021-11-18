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
    const gameBoard = ['', '', '', '', '', '', '', '', ''];
    const boxes = document.querySelectorAll('[data-index]');
    boxes.forEach(box => {
        box.addEventListener('click', (e) => {
            gamePlay.updateTurnCount();
            if(gamePlay.getTurnCount() > 9) return;
            let currentSign = (gamePlay.getTurnCount() % 2 !== 0) ? gamePlay.p1.getPlayerSign() : gamePlay.p2.getPlayerSign();
            gameBoard[parseInt(e.target.dataset.index)] = currentSign;
            renderBoard();
        });
    });
    const renderBoard = () => {
        for(let i = 0; i < 9; i++){
            if(gameBoard[i] === 'x') boxes[i].classList.add('x');
            else if(gameBoard[i] === 'o') boxes[i].classList.add('o');
        }
    }

    return{
        renderBoard,
    }
})();

const gamePlay = (function(){
    const p1 = playerFactory(welcomePageModule.getSign());
    const p2 = playerFactory((p1.getPlayerSign() == 'x') ? 'o' : 'x');
    let turnCounter = 0;
    const getTurnCount = () => turnCounter;
    const updateTurnCount = () => {
        turnCounter++;
    }

    return{
        p1,
        p2,
        updateTurnCount,
        getTurnCount,
    }
})();