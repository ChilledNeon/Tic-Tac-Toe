// Classic Logic is for a classic game of Tic-Tac-Toe

// The global variables needed 
let ClassicDifficulty = ''
let RoundCount = 0;
let hasWon = false;
let wonRound = false;
let computerTurn = false;
let UserWin = 0;
let CompWin = 0;

// The global lists needed
let PossibleSpots = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let UserPicks = [];
let CompPicks = [];

// A 2D list for all the possible winning moves
const WinningMoves = [
  ['1', '4', '7'],
  ['2', '5', '8'],
  ['3', '6', '9'],
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['1', '5', '9'],
  ['3', '5', '7']
];

// A function used for bringing in the selected options from 'Board.js'
export function handleClassicSettings(difficulty, rounds) {
    console.log(`Game mode: Classic, Difficulty: ${difficulty}, # of Rounds: ${rounds}`);
    ClassicDifficulty = difficulty;
    RoundCount = rounds;
}

// The "main function"
// It's an event listener that listens for a button being clicked by the user
document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");

    // Calling the Start game function
    StartGame();

    // This starts the round and determines if the user goes first or the computer
    function StartGame(){
      wonRound = false;
      if (computerTurn){
        Play();
      }
      else if(!computerTurn){
        activateUserClickListener();
      }
      computerTurn = !computerTurn;
    }
  
    // Function that allows the User to click a button
    function activateUserClickListener() {
      cells.forEach(cell => {
        cell.addEventListener("click", handleUserClick);
      });
    }
  
    // Function that disables the users ability to click a button when the computer is choosing
    function deactivateUserClickListener() {
      cells.forEach(cell => {
        cell.removeEventListener("click", handleUserClick);
      });
    }
  
    // Actual fucntion that handles the users input
    function handleUserClick() {
      const chosenSpot = this.dataset.id;
  
      // If the choosen spot is still in the list of possible moves and the game hasn't been won,
      //  then place the "x" in that spot and remove it from the list of possible moves
      //  and add it to the moves the user made. Finally check if that was the winning move.
      if (PossibleSpots.includes(chosenSpot) && !hasWon) {
        this.textContent = "X"; // Mark the cell
        this.style.backgroundColor = "#eee"; // Change the color of the cell
  
        const index = PossibleSpots.indexOf(chosenSpot);
        PossibleSpots.splice(index, 1);
  
        UserPicks.push(chosenSpot);
  
        IsWinner(0); // Check to see if a winning move was made. 0 denotes checking the Users spots
  
        if (!wonRound) {
          deactivateUserClickListener(); // Disable clicks during the computer's turn
          Play(); // Have the user play
        }
      } else {
        console.log("Invalid spot. Please choose another.");
      }
    }

    // Function to go to the correct choice function depending on the difficulty choosen 
    function Play(){
      if (ClassicDifficulty == 'Easy'){
        Easy();
      }
      else if (ClassicDifficulty == 'Medium' || ClassicDifficulty == 'Hard'){
        MedHard(); // Medium and Hard are close to the same functionality so they are handled in the same function
      }
    }

    // Chooses a random number, thus a random spot to play
    function Easy(){
      let randomIndex = Math.floor(Math.random() * PossibleSpots.length);
  
      // Use the random index to pick a random element
      let randomElement = PossibleSpots[randomIndex];
      AddCompToBoard(randomElement);
    }

    // Both Medium and Hard know how to block a potential winner from the user
    //  But Hard is the only one that knows how to make a winning move for itself
    function MedHard(){
      let choice = " ";
      if(PossibleSpots.length == 9 || PossibleSpots.length == 8){ // Checks to see if it is the computers first move of the round
        choice = firstMove(); // If it is, make an appropriate first selection
      }
      else{
        choice = Move(); // If it's not make a move based on the moves the user has made
      }
      AddCompToBoard(choice); // Once the choice is had, add it to the board in the right spot
    }

    // Assigns probability of picking the center and the 4 corners
    //  These spots are the best to ruin most stratagies in Tic-Tac-Toe, thus not loosing
    function firstMove(){
      const weights = [40, 15, 15, 15, 15]; // Weights for each option
      const options = ["5", "1", "3", "7", "9"]; // Corresponding options
    
      while (true) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0); // Sum of all weights
        const randomValue = Math.floor(Math.random() * totalWeight) + 1; // Random value between 1 and totalWeight
    
        let cumulativeWeight = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue <= cumulativeWeight) {
                if (PossibleSpots.includes(options[i])) {
                    return options[i]; // Return the valid choice
                }
                break; // If invalid, break to re-loop
            }
        }
      }
    }

    // The function for the medium and the hard to move after its first move
    //  Medium can only block, while Hard can block and win
    function Move(){
      let shouldBlock = false; // Making a variable to see if the need to block is on the board
    
      if (ClassicDifficulty == "Hard"){
        shouldBlock = Math.random() * 100 < 95; // The Hard difficulty has a 95% chance of blocking
      }
      else{
        shouldBlock = Math.random() * 100 < 70; // The Medium difficulty has a 70% chance of blocking 
      }
      
      // Checking to see if the Computer can win, only for the Hard difficulty
      //  This is the defult, the computer should always play a winning move over all other moves
      if(ClassicDifficulty == "Hard"){
        for (const innerArray of WinningMoves) {
          let count = 0; // Count the number of spots are in a winning combo 
          let emptySpot = -1 // Chacking to see what the empty spot might be
          for (const element of innerArray) {
            if (CompPicks.includes(element)) { // Going through each spot the computer picked to see if they together are winning moves
              count++; // Count each one that is in 
            }
            else if (PossibleSpots.includes(element)){
              emptySpot = element; // If it isn't, then that must be the spot to play the winning move
            }
      
            if (count === 2 && emptySpot > -1) { // It's a winning move only if their are already 2 in the row and there is an empty spot
              return emptySpot; // If it is empty, this is the spot for the computer to play
            }
          }
        }
      }
    
      // If there is no winning move or it's just Medium difficulty, check to see if there is a spot to block
      //  Only block if the random number choser says it's okay to block (The percetn chance from above)
      if(shouldBlock){
        for (const innerArray of WinningMoves) {
          let count = 0;
          let emptySpot = -1;
          for (const element of innerArray) {
            if (UserPicks.includes(element)) { // This if statement is all the same as the winning move apart from this. Cheeck the users spots for a winning move and block that
              count++;
            }
            else if (PossibleSpots.includes(element)){
              emptySpot = element;
            }
      
            if (count === 2 && emptySpot > -1) {
              return emptySpot;
            }
          }
        }
      }

      // If there is no winning move, nor a block needed, the computer should choose a random spot to play
      let randomIndex = Math.floor(Math.random() * PossibleSpots.length);
    
      let randomElement = PossibleSpots[randomIndex];
    
      return randomElement;
    }

    // The Function to add the computers spot to the board. The User already has one of these above
    function AddCompToBoard(spot){
      const chosenCell = document.querySelector(`[data-id='${spot}']`);
      if (chosenCell && chosenCell.textContent === " ") {
        chosenCell.textContent = "O";
        chosenCell.style.backgroundColor = "#eee";
    
        // Update available spots
        let index = PossibleSpots.indexOf(spot);
        let intValue = parseInt(index, 10) // The natural data type is String, so it's needed to covert the string number to an int number
        if (intValue > -1) {
          PossibleSpots.splice(intValue, 1);
        }
    
        CompPicks.push(spot); // Add the chosen spot to the computers picks 
      }

      IsWinner(1); // See if there is a winner. 1 denotes the computer

      if (!hasWon) {
        activateUserClickListener(); // Enable clicks for the user's turn
      }
    }
    
    // Function to pause the screen when a win, a tie, or a loss is recorded
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function IsWinner(listNumber) {
      // This part, I'm sure, is not ideal, nor efficiant
      // Depending on the number sent from before, 0 or 1, will determine which list is checked
      let holdList = []; // Set up a temperary list
      if (listNumber == 0) { // If zero was sent, the temperary list will be the user picks list
        holdList = UserPicks;
      } else if (listNumber == 1) {// If one was sent, the temperary list will be the computers list
        holdList = CompPicks;
      }
    
      // Check each winning combination
      for (const innerArray of WinningMoves) {
        let count = 0;
        for (const element of innerArray) {
          if (holdList.includes(element)) { // Check to see if a winning move is in the chosen list
            count++; // If there are 3 elements, this is seen as a winning combo
          }
    
          if (count === 3) { // We know there is a winning combo on the board
            if(holdList.sort().join(',') === UserPicks.sort().join(',')){ // If the temperary list is the User pick list, the user wins
              console.log("You Win");
              wonRound = true;
              UserWin++;
            }
            else if(holdList.sort().join(',') === CompPicks.sort().join(',')){ // If the temperary list is the computer pick list, the computer wins
              console.log("You Lose");
              CompWin++;
            }

            console.log("The Score is "+ UserWin + " - "+ CompWin); // Print the updated score

            await sleep(2000); // Add in a sleep function to pause and let the user see the board before resetting the game

            resetGame(); // Reset the game
            
          }
          else if (PossibleSpots.length == 0){
            console.log("It's a Tie"); // If nothing, then it is a tie

            console.log("The Score is "+ UserWin + " - "+ CompWin); // Print the updated score
            
            wonRound = true;

            await sleep(2000); // Add in a sleep function to pause and let the user see the board before resetting the game

            resetGame(); // Reset the game
          }
        }
      }
      return false;
    }

    // Function to reset the board and all the lists to their original states
    function resetGame(){
      cells.forEach(cell => {
        cell.textContent = " "; // Since the game is based on the buttons being " " by defult, need to reset it to that
        cell.style.backgroundColor = ""; // Styling reset
      });
      PossibleSpots = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      UserPicks = [];
      CompPicks = [];

      if(UserWin != RoundCount && CompWin != RoundCount){ // Check to see if Either the user's win count or the computer's round count are equal to the number of games the user wanted to play
        hasWon = false; // If it isn't keep the game win false
        StartGame(); // Then restart the game
      }
      else{
        console.log("The game is over"); // If one of them is equal, then the game is over
        hasWon = true; // Make true so neither the computer nor the user can make a move
      }
    }
  });
