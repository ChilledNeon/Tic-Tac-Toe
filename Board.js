import { handleClassicSettings } from './ClassicLogic.js';
import { handleVanishSettings } from './VanishLogic.js';
import { handleStackSettings } from './StackLogic.js';

let gameMode = '';
let gameDifficulty = '';
let roundCount = 1;

document.querySelector('.start-btn').addEventListener('click', () => {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('selection-screen').style.display = 'block';
});

function selectMode(event) {
    const button = event.target; // Get the clicked button
    gameMode = button.getAttribute('data-mode'); // Get the mode from the data attribute
    
    showDifficultyScreen();
}

// Function to display the difficulty screen
function showDifficultyScreen() {
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('difficulty-screen').style.display = 'block';
}

// Attach event listeners to all buttons with the class "mode-btn"
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', selectMode);
});

function selectDifficulty(event) {
    const button = event.target; // Get the clicked button
    gameDifficulty = button.getAttribute('data-mode'); // Get the mode from the data attribute

    showRoundScreen();    
}

// Function to display the difficulty screen
function showRoundScreen() {
    document.getElementById('difficulty-screen').style.display = 'none';
    document.getElementById('round-screen').style.display = 'block';
}

// Attach event listeners to all buttons with the class "mode-btn"
document.querySelectorAll('.dif-btn').forEach(button => {
    button.addEventListener('click', selectDifficulty);
});

function sendData(){
    if (gameMode == "Classic"){
        handleClassicSettings(gameDifficulty, roundCount);
    }
    else if(gameMode == "Vanish"){
        handleVanishSettings(gameDifficulty, roundCount);
    }
    else if(gameMode == "Stack"){
        handleStackSettings(gameDifficulty, roundCount);
    }
    showBoardScreen();
}

function selectRound(){
    const button = event.target; // Get the clicked button
    roundCount = button.getAttribute('data-mode'); // Get the mode from the data attribute

    sendData();
}

function showBoardScreen(){
    document.getElementById('round-screen').style.display = 'none';
    document.getElementById('board-screen').style.display = 'block';
}

document.querySelectorAll('.rnd-btn').forEach(button => {
    button.addEventListener('click', selectRound);
});
