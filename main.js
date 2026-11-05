const startBtn = document.querySelector("[data-btn='start']")
const resetBtn = document.querySelector("[data-btn='reset']")

const username = document.querySelector("[data-user='username']");

const userScoreField = document.querySelector("[data-score='user']");
const userNumField = document.querySelector("[data-num='user']");
const compScoreField = document.querySelector("[data-score='comp']");
const compNumField = document.querySelector("[data-num='comp']");

const msgFIeld = document.querySelector("[data-msg]");

let resUsername = prompt("Enter name");

while (resUsername === null || resUsername.trim() === '') {
    resUsername = prompt('Please, enter valid name'); 
}

username.textContent = resUsername.trim();

const WINNING_SCORE = 3;
let userScore = 0;
let computerScore = 0;

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handleStart = () => {
    const userNum = random(1, 6);
    const computerNum = random(1, 6);

    userNumField.textContent = userNum;
    compNumField.textContent = computerNum;

    if(userNum > computerNum) {
        userScore++;
        msgFIeld.textContent = `${resUsername} wins the round` ;
    } else if (computerNum > userNum) {
        computerScore++;
        msgFIeld.textContent = 'Computer wins the round';
    } else {
        msgFIeld.textContent = 'Draw';
    }

    userScoreField.textContent = userScore;
    compScoreField.textContent = computerScore;

    if (userScore === WINNING_SCORE) {
        msgFIeld.textContent = `${resUsername} wins the round` ;
        startBtn.disabled = true;
        resetBtn.hidden = false;
    } else if(computerScore === WINNING_SCORE) {
        msgFIeld.textContent = 'Computer wins the game';
        startBtn.disabled = true;
        resetBtn.hidden = false;
    }
}

const handleReset = () => {
    userScore = 0;
    computerScore = 0;
    userScoreField.textContent = 0;
    compScoreField.textContent = 0;
    userNumField.textContent = '?';
    compNumField.textContent = '?';
    msgFIeld.textContent = '';
    startBtn.disabled = false;
    resetBtn.hidden = true;
}

startBtn.addEventListener('click', handleStart);
resetBtn.addEventListener('click', handleReset);