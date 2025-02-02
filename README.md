# Tic-Tac-Toe
A web browser game of Tic-Tac-Toe with different game modes and difficulties. The game modes are Classic, Stack, and Vanish. The Difficulties are Easy, Medium, and Hard

All that is needed is to download the files into the same project space; I used VSCode. The only file that is needed to be run is the HTML file "TitleScreen.html".

This is what each difficulty in each game mode does

Classic: Just a normal game of Tic-Tac-Toe
  Easy: Chooses a random spot on the board. No stratagy
  Medium: Chooses a random spot when playing, but can block the player. To not make it too hard, there is a 70% chance that the computer actually blocks
  Hard: CHooses a random spot whem playing and can block. The chance of blocking is 95% this time. The Hard difficulty knows how to win, so if the computer can win, it will

Stack: Allows you to play on top of a spot that has already been played. The exceptions are that you can't play on top of yourself (that wouldn't be fun) and there are only 3 plays per spot. i.e. User play, Computer play, User play. Then that spot is unplayable
  Easy: Chooses a random spot on the board. No Stratagy
  Medium: If the User plays first, the computer will choose the opposite spot. If the user plays spot one, the computer will choose spot nine. If the computer plays first, it will either choose spot 5 (60% chance), 1,3,7, or 9 (10% chance each). The stratagy is the same as classic. It will play randomly until there is a spot to block. There is an 80% chance it will block
  Hard: The same first move logic is present for the hard difficulty. As well as the same 95% chance of blocking and a 100% chance of winning. If it is the users turn first, hard will choose a random spot. But if it is the computers turn first, the computer will pick a winning set and brute force the picks. 

  *Blocking in the stack game mode is a bit different. If you were to block in the same way as you would in classic or vanish, the computer could stack on top of that block and win. So blocking takes the two spots that are in position to win and sees which one, when covered, provides the best possitioning for it to win on it's next move

Vanish: Once the 4th move is made, the first move disappears from the board
  Easy: Chooses a random spot on the board. No stratagy
  Medium: If the User plays first, the computer will choose the opposite spot. If the user plays spot four, the computer will play spot six. If the computer plays first it will always choose the middle square as to help build a winning set. Instead of a random move, the computer will try to play in the middle. If that spot is already taken, it will try and take a corner spot. It also has a 20% chance of winning if there is a winning case present
  Hard: Same first move set as medium difficulty. It has a 100% chance of winning and a 95% chance of blocking when the cases are present
  
