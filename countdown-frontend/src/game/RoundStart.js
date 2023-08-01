import React, { useState } from "react";
import "./Game.css";

function RoundStart({ game, setGame }) {
  const { nextRound } = game;

  let header;
  let instructions;
  const [visibility, setVisibility] = useState(false);

  if (nextRound === "letters") {
    header = "Letters Round";
    instructions = [
      "Begin a Letters Round by drawing 9 letters in any order from the decks of vowels and consonants (note that you must select between 3 and 5 vowels). Once the final letter has been drawn, you will have 30 seconds to make the longest possible word using each letter tile only once.",
      "Tap letter tiles to form a word. You can use the 'Delete' button to remove individual letters from your attempt, or use the 'Clear' button to return all tiles to the board. Use the 'Save' button to save a word - this will return all tiles and allow you to attempt to find additional words.",
      "When time is up, you will be prompted to choose a word from those you saved as your final answer. If your attempt is included in the dictionary, you will score points equal to its length (double for 9 letter words).",
    ];
  } else if (nextRound === "numbers") {
    header = "Numbers Round";
    instructions = [
      "A Numbers Round is played using 6 number tiles. Begin the round by choosing how many tiles from the 'large number' (25, 50, 75, and 100) will be used. The remaining tiles will be drawn from the 'small numbers' deck (two each of numbers 1 through 10).",
      "The aim of a Numbers Round is to use some or all of the number tiles along with the four basic mathematical operations (addition, subtraction, multiplication, and/or division) to reach a randomly generated 3-digit number within 30 seconds. The time will start when the target score is displayed.",
      "To play, tap two number tiles and an operation - this will remove both tiles from the board, and replace them with a new tile containing the result of the calculation. You can then continue to make calculations in this manner until you have reached the target number, or are as close as possible to it.",
      "10 points are awarded for reaching the target number, 7 points for reaching a number within 5 of the target, and 5 points for reaching a number within 10 of the target. Note that the target score may be possible to reach!",
    ];
  } else {
    header = "Countdown Conundrum";
    instructions = [
      "A Countdown Conundrum is an anagram of a 9-letter word. You will have 30 seconds on display of the anagram to guess the scrambled word.",
      "Tapping a letter tile will stop the clock and lock that letter as the start letter of your guess. Tap the remaining tiles to add them to your guess - you may remove and re-add any letters EXCEPT for the first letter.",
      "A correct attempt scores 10 points.",
    ];
  }

  const displayInstructions = instructions.map((instruction) => {
    return <p className="text-white">{instruction}</p>;
  });

  const visibilityHandler = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  const startHandler = (event) => {
    event.preventDefault();
    setGame({ ...game, roundStart: false });
  };

  return (
    <div className="d-flex flex-row justify-content-center border border-light border-2 rounded rounded-3 p-3 mt-5">
      <div className="d-flex flex-column m-3">
        <h2 className="text-white fs-2 text-center">{header}</h2>
        {visibility ? (<div>{displayInstructions}</div>) : (<div></div>)}
        <div className="d-flex flex-row justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-secondary equal-size-btn"
            onClick={visibilityHandler}
          >
            Show/Hide Instructions
          </button>
          <button
            type="button"
            className="btn btn-primary equal-size-btn"
            onClick={startHandler}
          >
            Start Round
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoundStart;
