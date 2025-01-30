// Logic for the Vanish Game mode of Tic-Tac-Toe

// The global variables needed 
let VanishDifficulty = ''
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

export function handleVanishSettings(difficulty, rounds) {
    console.log(`Game mode: Vanish, Difficulty: ${difficulty}, Rounds: ${rounds}`);
    VanishDifficulty = difficulty;
    RoundCount = rounds;

    StartVanish();
}

// The "main function"
// It's an event listener that listens for a button being clicked by the user
function StartVanish(){
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
  
        if(UserPicks.length === 4){
          let lostValue = UserPicks.shift();
          RemoveSpot(lostValue);
        }

        if (!wonRound) {
          deactivateUserClickListener(); // Disable clicks during the computer's turn
          setTimeout(() => {
            Play(); // Have the Computer play
          }, 500);
        }
      } 
      else {
        document.getElementById('message').textContent = "Invalid Spot, Please choose again";
        setTimeout(function() {
          document.getElementById('message').textContent = "";
        }, 2000);
      }
    }

    function Play(){
        if(VanishDifficulty == "Easy"){
          Easy();
        }
        else{
          MedHard();
        }
    }

    function Easy(){
      let randomIndex = Math.floor(Math.random() * PossibleSpots.length);
  
      // Use the random index to pick a random element
      let randomElement = PossibleSpots[randomIndex];

      AddCompToBoard(randomElement);
    }

    function MedHard(){
      let choice = " ";
      const tempList = ["1", "3", "7", "9"];
      let shouldBlock = false;
      let shouldWin = false;
      if(VanishDifficulty == "Hard"){
        shouldBlock = Math.random() * 100 < 95; // Hard has a 95% chance of blocking
        shouldWin == true// It also have a 100% chance of winning if possible
      }
      else if(VanishDifficulty == "Medium"){
        shouldBlock = Math.random() * 100 < 80; // Medium has a 80% chance of blocking
        shouldWin = Math.random() * 100 < 20; // 20% chance that the computer will intentially win
      }

      if(PossibleSpots.length == 9){
        choice = "5";
      }
      else if(PossibleSpots.length == 8){
        // Math to choose the opposite spot of the user
        let userchoice = UserPicks[0];
        let z = userchoice - 5;
        z = z * -1
        let compNum = 5 + z;
        choice = compNum.toString();
      }

      if(choice == " " && shouldWin){
        choice = Win();
      }
      if(choice == " " && shouldBlock){
        choice = Block();
      }
      if(choice == " "){
        if(PossibleSpots.includes("5")){
          choice = "5";
        }
        else{
          let randomIndex = "0";
          let randomElement = "0";
          while(randomElement == "0"){
            randomIndex = Math.floor(Math.random() * tempList.length);
    
            // Selecting a Random Corner on the board
            randomElement = tempList[randomIndex];
            if(!PossibleSpots.includes(randomElement)){
              randomElement = "0";
            }
          }
          choice = randomElement;
        }
      }  
      AddCompToBoard(choice);
    }

    // Blocking Function that allows the conputer to block
    //  Don't need to remove the first element because that step should already be done by the time we get here
    function Block(){
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
      return " ";
    }

    // Same thing for the Win as it was for the block. Only differences are the change of which list we are checking
    //  As well as removing the first element. If this isn't done, we will get a false possitive
    function Win(){ // -> Remove the first element before checking
      for (const innerArray of WinningMoves) {
        let count = 0; // Count the number of spots that are in a winning combo 
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
      return " ";
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
      } 
      else if (listNumber == 1) {// If one was sent, the temperary list will be the computers list
        holdList = CompPicks;
      }
    
      // Check each winning combination
      for (const innerArray of WinningMoves) {
        let count = 0;
        for (const element of innerArray) {
          if (holdList.includes(element)) { // Check to see if a winning move is in the chosen list
            count++; // If there are 3 elements, this is seen as a winning combo
          }
    
          // A check to see if the list contains a winning solution
          //  Because of the nature of the game, it isn't possible to have a tie
          //  The game removes the square when one list gets greater than 4, thus always having 2 free squares
          if (count === 3) { // We know there is a winning combo on the board
            if(holdList.sort().join(',') === UserPicks.sort().join(',')){ // If the temperary list is the User pick list, the user wins
              document.getElementById('message').textContent = "You Win!";
              setTimeout(function() {
                document.getElementById('message').textContent = "";
              }, 2000);

              wonRound = true;
              UserWin++;
            }
            else if(holdList.sort().join(',') === CompPicks.sort().join(',')){ // If the temperary list is the computer pick list, the computer wins
              document.getElementById('message').textContent = "You Lose";
              setTimeout(function() {
                document.getElementById('message').textContent = "";
              }, 2000);

              CompWin++;
            }

            // Update the score on the board
            document.getElementById('scoreX').textContent = UserWin;
            document.getElementById('scoreO').textContent = CompWin;

            await sleep(2000); // Add in a sleep function to pause and let the user see the board before resetting the game

            resetGame(); // Reset the game
            
          }
          // The condition to have a spot "vanish"
          else if(count != 3){
            let lostValue = 0;
            // Check to see if the lists have a length greater than 4
            if(listNumber === 1 && CompPicks.length === 4){
              lostValue = CompPicks.shift(); // Remove the first element from the list
              RemoveSpot(lostValue); // Remove it from the board
              PossibleSpots.push(lostValue); // Add it back to the Possible spots
            }
            else if(listNumber === 0 && UserPicks.length === 4){
              lostValue = UserPicks.shift();
              RemoveSpot(lostValue);
              PossibleSpots.push(lostValue);
            }
          }
        }
      }
      return false;
    }

    // Function that will have the spot vanish when needed.
    function RemoveSpot(value){
      const chosenCell = document.querySelector(`[data-id='${value}']`);
      if (chosenCell && chosenCell.textContent != " ") {
        chosenCell.textContent = " ";
        chosenCell.style.backgroundColor = "";
      }
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
        document.getElementById('message').textContent = "The Game is Over!";
        setTimeout(function() {
          document.getElementById('message').textContent = "";
        }, 2000);// If one of them is equal, then the game is over
        hasWon = true; // Make true so neither the computer nor the user can make a move
      }
    }
  };
