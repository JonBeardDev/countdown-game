# Countdown: The Game

Based on the popular British Game shows *Countdown* and *8 Out of 10 Cats Does Countdown*, this single page React app allows you to play a single-player version of the Letters, Numbers, and Countdown Conundrum rounds in varying length games.

[Link](https://countdown-cd36.onrender.com/) to deployed game.

![Image showing the Menu screen with game types radio buttons on the left and game description on the right with Start button](/images/Menu.png)

## Letters Round

Begin a Letters Round by drawing 9 letters in any order from the decks of vowels and consonants (note that you must select between 3 and 5 vowels). Once the final letter has been drawn, you will have 30 seconds to make the longest possible word using each letter tile only once.

Tap letter tiles to form a word. Each tile may be used only once in a word - tiles will "hide" when tapped to prevent reuse.

You can use the 'Delete' button to remove individual letters from your attempt, or use the 'Clear' button to return all tiles to the board. Use the 'Save' button to save a word - this will return all tiles and allow you to attempt to find additional words.

When time is up, you will be prompted to choose a word from those you saved as your final answer. If your attempt is included in the dictionary, you will score points equal to its length (double for 9 letter words).

![Image showing an example of a Letters round, with the randomly drawn vowels and consonants at the top ("XREIHROND") and the word "DINER" formed from them by the user. There are 8 seconds remaining in the game, as shown above the drawn letters.](/images/Letters.png)

After submitting your final word, the game will show the longest possible word that could have been made with the available letters, along with a table of other possible words.

![Image showing the results of the Letters round. The user's word "DINER" is in green to show it is in the dictionary and therefore acceptable. Below, the best possible word ("HORNIER") is shown.](/images/Letters-Results.png)

## Numbers Round

A Numbers Round is played using 6 number tiles. Begin the round by choosing how many tiles from the 'large number' (25, 50, 75, and 100) will be used. The remaining tiles will be drawn from the 'small numbers' deck (two each of numbers 1 through 10).

![Image showing the start of a Numbers round with blank tiles, a blank target (000) and blank Best (0), along with buttons to select how many Large numbers to use.](/images/Numbers-pre-selection.png)

![Image showing the selected numbers on tiles. The user selected 1 Large / 5 Small Numbers and received 100, 4, 1, 1, 9, and 6. The user is prompted to press the button below to get a target score and begin the round.](/images/Numbers-start.png)

The aim of a Numbers Round is to use some or all of the number tiles along with the four basic mathematical operations (addition, subtraction, multiplication, and/or division) to reach a randomly generated 3-digit number within 30 seconds. The time will start when the target score is displayed.

To play, tap two number tiles and an operation - this will remove both tiles from the board, and replace them with a new tile containing the result of the calculation. You can then continue to make calculations in this manner until you have reached the target number, or are as close as possible to it.

![Image showing an in-progress Numbers round. The target has been randomly set to 224. The user has started making calculations using the 100, 1, and 1 tiles. The 100 has been replaced with 200 as a result of these calculations, while the 1 tiles have been hidden. The Best attempt has been updated to 200 as that is the closest the user has got to the target so far. Below the number tiles are operation buttons and Clear, Undo, and End round buttons](/images/Numbers.png)

10 points are awarded for reaching the target number, 7 points for reaching a number within 5 of the target, and 5 points for reaching a number within 10 of the target. Note that the target score may be possible to reach! If you do not reach the target, the game will show you a possible way of reaching it (if it is possible)

![Image showing the end of a Numbers round. The user reached the target of 224 (Best shows 224) and has scored 10 points.](/images/Numbers-end.png)

## Countdown Conundrum

A Countdown Conundrum is an anagram of a 9-letter word. You will have 30 seconds on display of the anagram to guess the scrambled word.

![Image showing the start of a conundrum round. The user is presented with the tiles ("WSACOERRC") and the timer has started. Below the tiles are blank tiles ready for the user's attempt, should they make one](/images/Conundrum-start.png)

Tapping a letter tile will stop the clock and lock that letter as the start letter of your guess. Tap the remaining tiles to add them to your guess - you may remove and re-add any letters EXCEPT for the first letter.

![Image showing the user attempting a guess at the conundrum. After tapping the "S" tile with 10 seconds to go, the time has stopped. Below the tiles are a Delete Last Letter button, Submit Answer button, which is disabled until all tiles are used, and a Give Up button. The user has entered "SCARECROW" as their guess](/images/Conundrum-guess.png)

A correct attempt scores 10 points.

![Image showing the user has correctly guessed the conundrum (User's answer is highlighted in green). The original anagram is shown, with the user's answer below, and the correct answer below that. At the bottom is a button to go to the final score](/images/Conundrum-end.png)

## Final score

Currently, the player will see their total score alongside the total possible points. Eventually, this page will also include game and overall statistics.

![Image showing the user scored 25 out of a maximum possible 27 points](/images/Final-score.png)

## Coming soon

Minor fixes:
- Add "End Round" button to Letters Round, should a player think they already have the longest possible word.
- Add "Next Round" button above all possible words on the end screen of a Letters Round, so a player can quickly move on to the next round without scrolling, should they want to.

Future updates include:
- Adjustable timer - On the menu, choose to play standard 30 second rounds, challenging 15 second rounds, more lenient 60 second rounds, or unlimited time.
- Option to create a user profile and save statistics - Want to know your average word length, your 9 letter-words found, or how many times you have sovled a numbers problem or conundrum? These and other statistics will be coming soon.
- Mobile optimization - Game is currently only optimized for a standard screen size. Adjustments for smaller screens will be coming soon (Note that game will likely have to be played horizontally on mobile).
