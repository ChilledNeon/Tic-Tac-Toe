import { handleClassicSettings } from './ClassicLogic.js';
import { handleVanishSettings } from './VanishLogic.js';
import { handleStackSettings } from './StackLogic.js';

const settingsIcon = document.getElementById("settingsIcon");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");

let gameMode = '';
let difficulty = '';
let games = 1;

// Show the sidebar when the settings icon is clicked
settingsIcon.addEventListener("click", () => {
    sidebar.style.right = "0";
});

// Hide the sidebar when the close button is clicked
closeBtn.addEventListener("click", () => {
    sidebar.style.right = "-300px";
});

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Attach submit button event listener
    submitBtn.addEventListener("click", handleGameSetup);
});

// Function to handle game setup and transition to the second screen
function handleGameSetup() {
    // Retrieve selected game mode
    gameMode = document.querySelector('input[name="mode"]:checked').value;

    // Retrieve selected difficulty
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    // Retrieve selected number of games
    games = document.querySelector('input[name="games"]:checked').value;

    // Pass data to the respective logic handler based on the game mode
    sendGameData();

    // Transition to the second screen
    document.getElementById("title-screen").style.display = "none";
    document.getElementById("board-screen").style.display = "block";
}

// Function to handle game logic based on the selected game mode
function sendGameData() {
    switch (gameMode) {
        case "Classic":
            handleClassicSettings(difficulty, games);
            break;
        case "Vanish":
            handleVanishSettings(difficulty, games);
            break;
        case "Stack":
            handleStackSettings(difficulty, games);
            break;
        default:
            console.error("Invalid game mode:", gameMode);
    }
}
