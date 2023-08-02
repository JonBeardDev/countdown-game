import React, { useEffect, useState, useCallback } from "react";
import { shuffle } from "../utils/shuffle";
import conundrums from "../decks/conundrums";
import Tile from "./Tile";
import "./Game.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// Pull random word from conundrums library file
const getConundrum = () => {
  const randomIndex = Math.floor(Math.random() * conundrums.length);
  return conundrums[randomIndex];
};

function Conundrum({ game, setGame, setTotal, setMax }) {
  const history = useHistory();
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [guess, setGuess] = useState(Array(9).fill(""));
  const [firstClick, setFirstClick] = useState(false);
  const [all9, setAll9] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerRunning, setTimerRunning] = useState(true);
  const [answer, setAnswer] = useState("");
  const [conundrum, setConundrum] = useState([]);

  // Start new conundrum each time Conundrum component is mounted (i.e. doesn't require refresh)
  useEffect(() => {
    setNewConundrum();
  }, []);

  const setNewConundrum = () => {
    const newAnswer = getConundrum();
    setAnswer(newAnswer);
    setConundrum(shuffle(newAnswer.split("")));
  };

  const submitHandler = useCallback(() => {
    setSubmitted(true);

    // If user runs out of time or gives up, guess is marked as blank and incorrect
    if (guess.join("").trim().length < 9) {
      setIsCorrect(false);
      setGuess(Array(9).fill(""));
    } else {
      // Check guess in string form versus answer pulled from conundrums file
      const correctGuess =
        guess.join("").toLowerCase() === answer.toLowerCase();
      setIsCorrect(correctGuess);
    }
    // Clear hidden indices so that original conundrum, guess, and answer are not hidden
    setHiddenIndices([]);
    setFirstClick(false);
  }, [guess, answer]);

  // Start 30 second timer on game start. "Submit" at end of 30 seconds.
  useEffect(() => {
    let timer = null;

    if (timerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerRunning(false);
      if (!submitted) {
        submitHandler();
      }
    }

    return () => clearTimeout(timer);
  }, [timerRunning, timeRemaining, submitted, submitHandler]);

  const clickHandler = (event, letter, index) => {
    event.preventDefault();

    // First click is used to both stop the timer and locks in the first clicked letter as the start of the guess
    if (!firstClick) {
      setFirstClick(true);
      setTimerRunning(false);
    }

    // Add letters to user guess
    const emptyIndex = guess.findIndex((tile) => tile === "");
    if (emptyIndex >= 0 && emptyIndex < 9) {
      // Add the letter to the first empty space in the user's guess
      const newGuess = [...guess];
      newGuess[emptyIndex] = letter;
      setGuess(newGuess);
    }

    // Hide clicked tiles so they can't be used again
    setHiddenIndices((prevHiddenIndices) => [...prevHiddenIndices, index]);

    // Enable Submit button when all tiles have been clicked and added to the guess
    if (hiddenIndices.length === 8) {
      setAll9(true);
    }
  };

  // Delete any letter from the guess EXCEPT for first letter. Unhide letter in anagram
  const deleteHandler = () => {
    if (hiddenIndices.length > 1) {
      let lastFilledIndex;
      if (all9) {
        setAll9(false);
        lastFilledIndex = guess.length - 1;
      } else {
        lastFilledIndex = guess.indexOf("") - 1;
      }

      const newGuess = [...guess];
      newGuess[lastFilledIndex] = "";
      setGuess(newGuess);

      hiddenIndices.pop();
      setHiddenIndices(hiddenIndices);

      if (all9) {
        setAll9(false);
      }
    } else {
      window.alert(
        "As you have 'buzzed in', the first letter of your guess may not be deleted."
      );
    }
  };

  // Map each letter in the conundrum to a tile. Should be clickable when visible until submitted is true
  const letters = conundrum.map((letter, index) => (
    <Tile
      key={index}
      value={letter}
      isVisible={!hiddenIndices.includes(index)}
      onClick={(event) => clickHandler(event, letter, index)}
      clickable={!submitted}
    />
  ));

  // Map each letter in the user guess to a tile. Should never be clickable. IsCorrect/IsIncorrect determines tile color on submit
  const userGuessTiles = guess.map((letter, index) => {
    console.log(submitted, isCorrect);
    return (
      <Tile
        key={index}
        value={letter}
        isVisible={submitted || (!submitted && letter)}
        isCorrect={submitted && isCorrect}
        isIncorrect={submitted && !isCorrect}
        clickable={false}
      />
    );
  });

  // Return to main menu at end of single conundrum game
  const menuButton = (event) => {
    event.preventDefault();
    history.push("/menu");
  };

  // Add to game and max possible score. Set gameOver to be true to mount GameOver (final score) component.
  const finalScoreButton = (event) => {
    event.preventDefault();
    setMax((currentMax) => currentMax + 10);
    if (isCorrect) {
      setTotal((currentTotal) => currentTotal + 10);
    }
    setGame({ ...game, gameOver: true });
  };

  return (
    <div className="d-flex flex-column justify-content-center border border-light border-2 rounded rounded-3 p-5 mt-5">
      <h3 className="text-white fs-2 text-center pb-3">COUNTDOWN CONUNDRUM</h3>
      <div className="time-remaining text-white fs-4 text-center">
        Time Remaining: {timeRemaining} seconds
      </div>
      <div className="d-flex pt-3 mx-5 justify-content-center">
        <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
          {letters}
        </div>
      </div>
      <h3 className="text-white fs-2 text-center pb-3">YOUR ANSWER</h3>
      <div className="d-flex pt-3 mx-5 justify-content-center">
        <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
          {userGuessTiles}
        </div>
      </div>
      {!submitted && (
        <>
          <div className="d-flex pt-3 mx-5 justify-content-center gap-3">
            {firstClick && (
              <>
                <button
                  className="btn btn-danger equal-size-btn"
                  onClick={deleteHandler}
                >
                  Delete Last Letter
                </button>
                <button
                  className="btn btn-primary equal-size-btn"
                  onClick={submitHandler}
                  disabled={!all9}
                >
                  Submit Answer
                </button>
                <button
                  className="btn btn-secondary equal-size-btn"
                  onClick={submitHandler}
                >
                  Give Up
                </button>
              </>
            )}
          </div>
        </>
      )}
      {submitted && (
        <>
          <h3 className="text-white fs-2 text-center pb-3">CORRECT ANSWER</h3>
          <div className="d-flex pt-3 mx-5 justify-content-center">
            <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
              {answer.split("").map((letter, index) => (
                <Tile
                  key={index}
                  value={letter}
                  isVisible={true}
                  clickable={false}
                />
              ))}
            </div>
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center text-white fs-2 text-center pb-3">
            You scored {isCorrect ? 10 : 0} out of a possible 10 points.
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center gap-2">
            {game.type === "conundrum" ? (
              <button className="btn btn-primary btn-lg" onClick={menuButton}>
                Return to Menu
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={finalScoreButton}
              >
                View Final Score
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Conundrum;
