// Logic for the Stack game mode of Tic-Tac-Toe

let StackDifficulty = ' ';
let RoundCount = 0;
let hasWon = false;
let wonRound = false;
let computerTurn = false;
let UserWin = 0;
let CompWin = 0;

let ranNum = Math.floor(Math.random() * 8);

let PossibleSpots = ['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4', '5', '5', '5',
  '6', '6', '6', '7', '7', '7', '8', '8', '8', '9', '9', '9'];
let UserPicks = [];
let CompPicks = [];

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

export function handleStackSettings(difficulty, rounds) {
    console.log(`Game mode: Stack, Difficulty: ${difficulty}, # of Rounds: ${rounds}`);
    StackDifficulty = difficulty;
    RoundCount = rounds;
}

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

      if (PossibleSpots.includes(chosenSpot) && !hasWon && !UserPicks.includes(chosenSpot)) { // Need an extra condition here for if the spot is already taken by the User
        this.textContent = "X"; // Mark the cell
        this.style.backgroundColor = "#eee"; // Change the color of the cell
  
        const index = PossibleSpots.indexOf(chosenSpot);
        PossibleSpots.splice(index, 1);
  
        UserPicks.push(chosenSpot);

        if (CompPicks.includes(chosenSpot)){
          const ind = CompPicks.indexOf(chosenSpot);
          CompPicks.splice(ind, 1);
        }
  
        IsWinner(0); // Check to see if a winning move was made. 0 denotes checking the Users spots
  
        if (!wonRound) {
          deactivateUserClickListener(); // Disable clicks during the computer's turn
          Play(); // Have the user play
        }
        else {
          console.log("Invalid spot. Please choose another.");
        }
      }
      else{
        console.log("Doesn't work");
      }
    }

    function Play(){
      if(StackDifficulty == "Easy"){
        Easy();
      }
      else if(StackDifficulty == "Medium"){
        Medium();
      }
      else if(StackDifficulty == "Hard"){
        Hard();
      }
      else{
        console.log("Error in Play if statement");
      }
    }

    function Easy(){
      let randomIndex = 0;
      let randomElement = 0;

      while(randomElement == 0){
        randomIndex = Math.floor(Math.random() * PossibleSpots.length);
        randomElement = PossibleSpots[randomIndex];
        if(CompPicks.includes(randomElement)){
          randomElement = 0;
        }
      }
      AddCompToBoard(randomElement);

    }

    function Medium(){
      let choice = " ";
      if(PossibleSpots.length == 27 || PossibleSpots.length == 26){ // Checks to see if it is the computers first move of the round
        choice = firstMoveMedium(); // If it is, make an appropriate first selection
      }
      else{
        choice = PlayMedium();
      }
      AddCompToBoard(choice);
    }

    function firstMoveMedium(){
      if(PossibleSpots.length == 27){
        const weights = [60, 10, 10, 10, 10]; // Weights for each option
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
      else if(PossibleSpots.length == 26){
        // Math to choose the opposite spot of the user
        let userchoice = UserPicks[0];
        let z = userchoice - 5;
        z = z * -1
        let compNum = 5 + z;
        return compNum.toString();
        
      }
      else{
        console.log("Error in First Move");
      }
    }

    function PlayMedium(){
      let choice = " ";

      let shouldBlock = Math.random() * 100 < 80; // Medium has a 80% chance of blocking

      if(UserPicks.length > 1 && shouldBlock){
        choice = Block();
        console.log("Block Choice: " + choice);
      }
      if (choice === " "){
        let randomIndex = 0;

        while(choice == " "){
          randomIndex = Math.floor(Math.random() * PossibleSpots.length);
          choice = PossibleSpots[randomIndex];
          if(CompPicks.includes(choice)){
            choice = " ";
          }
        }
        console.log("Random Choice: " + choice);
      }
      return choice;
    }

    function Hard() {
      let choice = " ";
      console.log(PossibleSpots.length);
      if(PossibleSpots.length % 2 == 1){
        choice = compTurnHard();
      }
      else{
        choice = userTurnHard();
      }
    
      // Add the computer's choice to the board
      CompPicks.push(choice);
      AddCompToBoard(choice);
    }

    function compTurnHard(){
      console.log("Comp");
      // Choose a random winning move row
      let choices = WinningMoves[ranNum];
      console.log(choices);
    
      let choice = " ";
    
      let shouldBlock = Math.random() * 100 < 95; // Hard difficulty has a 95% chance of blocking
    
      choice = Win();

      if (choice === " ") {
        if (UserPicks.length > 1 && shouldBlock) {
          choice = Block();
        }
      
        // If no blocking move is found, choose a random spot from the selected row
        else{
          let availableSpots = choices.filter((spot) => !CompPicks.includes(spot));
          if (availableSpots.length > 0) {
            let randomIndex = Math.floor(Math.random() * availableSpots.length);
            choice = availableSpots[randomIndex];
          } 
          else {
            console.error("No valid moves available in selected row.");
            return; // Exit function to avoid infinite loop
          }
        }
      }
      console.log(choice);
      return choice;
    }

    function userTurnHard(){
      console.log("User");
      let choice = " ";

      let shouldBlock = Math.random() * 100 < 95; // Medium has a 80% chance of blocking

      if(PossibleSpots.length == 26){
        // Math to choose the opposite spot of the user
        let userchoice = UserPicks[0];
        let z = userchoice - 5;
        z = z * -1
        let compNum = 5 + z;
        return compNum.toString();
      }

      // Checking to see if the computer can win
      choice = Win();

      if (choice === " "){
        if(UserPicks.length > 1 && shouldBlock){
          choice = Block();
          console.log("Block Choice: " + choice);
        }
        else{  
          let randomIndex = 0;
  
          while(choice == " "){
            randomIndex = Math.floor(Math.random() * PossibleSpots.length);
            choice = PossibleSpots[randomIndex];
            if(CompPicks.includes(choice)){
              choice = " ";
            }
          }
          console.log("Random Choice: " + choice);
        }
      }
      return choice;
    }

    function Block(){
      let count = 0;
      let count1 = "";
      let count2 = "";
      for (const innerArray of WinningMoves) {
        count = 0;
        count1 = "";
        count2 = "";
  
        for (const element of innerArray) {
          if (UserPicks.includes(element)) {
            count++; // Count user's marks in this row
            if(count == 1){
              count1 = element;
            }
            else if(count == 2){
              count2 = element;
            }
          }
        }
        if(count == 2){
          break;
        }
      }
      // If the user is about to win (2 spots filled), block it
      //  At this point, I know there needs to be a block, So I am checking to see if the block spot is available
      //   as well as seeing which spot lines up best with the computers existing moves
      if (count === 2) {
        let compCount1 = 0;
        let compCount2 = 0;

        // Playing errors are present!! Need to figure out what this problem is
        // I.E. Not playing in the ideal blocking spot and not playing sometimes when not covering the computers spot
        for(const innerArray of WinningMoves){
          // Check to see if the "first option" is a playable space
          if (PossibleSpots.includes(count1) && !CompPicks.includes(count1)){
            // Push the first option to the array and see if it is a good move to make relitive to the other moves made by the computer
            CompPicks.push(count1);
            for(const element of innerArray){
              // console.log(element);
              if (CompPicks.includes(element)) {
                // Rename
                compCount1++;
              }
            }
            // After done cheching, remove the spot as to not affect later logic
            CompPicks.pop();
            if(compCount1 > 1){
              return count1;
            }
          }
          if(PossibleSpots.includes(count2) && !CompPicks.includes(count2)){
            CompPicks.push(count2);
            for(const element in innerArray){
              if (CompPicks.includes(element)) {
                // Rename
                compCount2++;
              }
            }
            CompPicks.pop();
            if(compCount2 > 1){
              return count2;
            }
          }
        }
      }
      else{
        return " ";
      }
    }

    // Function to allow the hard difficulty to win in possible
    function Win(){
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
      return " "
    }

    // The Function to add the computers spot to the board. The User already has one of these above
    function AddCompToBoard(spot){
      const chosenCell = document.querySelector(`[data-id='${spot}']`);
      if (chosenCell) {
        chosenCell.textContent = "O";
        chosenCell.style.backgroundColor = "#eee";
    
        // Update available spots
        let index = PossibleSpots.indexOf(spot);
        let intValue = parseInt(index, 10) // The natural data type is String, so it's needed to covert the string number to an int number
        if (intValue > -1) {
          PossibleSpots.splice(intValue, 1);
        }
        // Remove the choice from UserPicks if necessary
        if (UserPicks.includes(spot)) {
          const ind = UserPicks.indexOf(spot);
          UserPicks.splice(ind, 1);
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
        cell.style.backgroundColor = ""; // Optional styling reset
      });

      PossibleSpots = ['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4', '5', '5', '5',
        '6', '6', '6', '7', '7', '7', '8', '8', '8', '9', '9', '9'];
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
