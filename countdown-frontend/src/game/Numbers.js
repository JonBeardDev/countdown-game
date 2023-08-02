import React, { useState, useEffect, useCallback } from "react";
import bigNumbers from "../decks/bigNumbers";
import smallNumbers from "../decks/smallNumbers";
import { shuffle } from "../utils/shuffle";
import "./Game.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import NumberTile from "./NumberTile";
import { calculation } from "../utils/calculation";
import { targetReachable } from "../utils/targetReachable";

function Numbers({ game, setGame, setTotal, setMax }) {
  const history = useHistory();
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [numbers, setNumbers] = useState(Array(6).fill(""));
  const [amountBigNumbers, setAmountBigNumbers] = useState(null);
  const [bestAttempt, setBestAttempt] = useState(0);
  const [targetScore, setTargetScore] = useState("000");
  const [isTargetReachable, setisTargetReachable] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [chooseNumbers, setChooseNumbers] = useState(true);
  const [roundEnd, setRoundEnd] = useState(false);
  const [getTarget, setGetTarget] = useState(false);
  const [numbersChosen, setNumbersChosen] = useState(false);
  const [operation, setOperation] = useState(null);
  const [selectedTileIndices, setSelectedTileIndices] = useState([]);
  const [initialNumbers, setInitialNumbers] = useState([]);
  const [undoState, setUndoState] = useState([]);
  const [score, setScore] = useState(0);
  const [solution, setSolution] = useState(null);

  // Make a copy of the original decks
  const originalBigNumbers = bigNumbers.slice();
  const originalSmallNumbers = smallNumbers.slice();

  useEffect(() => {
    shuffle(originalBigNumbers);
    shuffle(originalSmallNumbers);
  }, [originalBigNumbers, originalSmallNumbers]);

  // Ensure initial state is reset at beginning/end of round
  const resetState = () => {
    setHiddenIndices([]);
    setNumbers(Array(6).fill(""));
    setAmountBigNumbers(null);
    setBestAttempt(null);
    setisTargetReachable([]);
    setTargetScore("000");
    setTimeRemaining(30);
    setTimerRunning(false);
    setChooseNumbers(true);
    setRoundEnd(false);
    setGetTarget(false);
    setNumbersChosen(false);
    setOperation(null);
    setSelectedTileIndices([]);
    setInitialNumbers([]);
    setUndoState([]);
    setScore(0);
    setSolution(null);
  };

  const shuffleDecks = useCallback(() => {
    shuffle(originalBigNumbers);
    shuffle(originalSmallNumbers);
  }, [originalBigNumbers, originalSmallNumbers]);

  const resetStateAndShuffleDecks = useCallback(() => {
    resetState();
    shuffleDecks();
  }, [shuffleDecks]);

  // Ensure state is reset if backing out to menu or starting new round
  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP" && location.pathname === "/menu") {
        resetStateAndShuffleDecks();
      }
    });

    return () => unlisten();
  }, [history, resetStateAndShuffleDecks]);

  // For displaying numbers round numbers (round x of y)
  const roundNum = game.numbers;
  let totalRounds;
  switch (game.type) {
    case "full":
      totalRounds = 4;
      break;
    case "short":
      totalRounds = 2;
      break;
    default:
      totalRounds = 1;
  }

  // Works in tandem with below useEffect to draw number tiles from decks
  const chooseTiles = (numBigNumbers) => {
    setAmountBigNumbers(numBigNumbers);
    setNumbersChosen(true);
  };

  useEffect(() => {
    if (numbersChosen) {
      shuffleDecks();

      const newNumbers = [];
      // Add x number of Big numbers to first x slots, fill rest with small numbers
      for (let i = 0; i < amountBigNumbers; i++) {
        newNumbers.push(originalBigNumbers.pop());
      }
      for (let i = amountBigNumbers; i < 6; i++) {
        newNumbers.push(originalSmallNumbers.pop());
      }

      setNumbers(newNumbers);
      setInitialNumbers(newNumbers);
      setChooseNumbers(false);
      setGetTarget(true);
    }
  }, [
    amountBigNumbers,
    numbersChosen,
    shuffleDecks,
    originalBigNumbers,
    originalSmallNumbers,
  ]);

  const targetHandler = (event) => {
    event.preventDefault();
    // Set target to random 3 digit number
    setTargetScore(Math.floor(Math.random() * 900) + 100);
    setGetTarget(false);
    setTimerRunning(true);
  };

  // Determine if target is reachable and return steps if possible
  useEffect(() => {
    if (targetScore !== "000") {
      const reachableSteps = targetReachable(initialNumbers, targetScore);
      setisTargetReachable(reachableSteps);
    }
  }, [initialNumbers, targetScore]);

  // If steps are available, create display of steps in standard mathematical form
  useEffect(() => {
    if (isTargetReachable && isTargetReachable.length > 0) {
      const newSolution = isTargetReachable.map((step) => {
        let calculation;
        switch (step.operation) {
          case "+":
            calculation = step.numbers[0] + step.numbers[1];
            break;
          case "-":
            calculation = step.numbers[0] - step.numbers[1];
            break;
          case "*":
            calculation = step.numbers[0] * step.numbers[1];
            break;
          case "/":
            calculation = step.numbers[0] / step.numbers[1];
            break;
          default:
            calculation = step.numbers[0];
            break;
        }
        return (
          <div className="time-remaining text-white fs-5 text-center">
            {step.numbers[0]} {step.operation} {step.numbers[1]} = {calculation}
          </div>
        );
      });
      // Remove final line, as it only shows 'target' = 'target'
      newSolution.pop();
      setSolution(newSolution);
    }
  }, [isTargetReachable]);

  // Handle clicking operation button
  const operationHandler = (op) => {
    // Toggle operation selected
    setOperation((prevOp) => (prevOp === op ? null : op));

    // If two number tiles are selected, calculate result
    if (selectedTileIndices.length === 2) {
      const [leftIndex, rightIndex] = selectedTileIndices;
      const x = numbers[leftIndex];
      const y = numbers[rightIndex];
      const result = calculation(op, x, y);

      // If calculation is possible (positive integer)...
      if (result !== null && Number.isInteger(result)) {
        // Move current number tiles to undo state for undo button
        setUndoState((prev) => [...prev, { numbers, hiddenIndices }]);

        const updatedNumbers = [...numbers];

        // Replace leftmost number with result, hide rightmost tile
        if (leftIndex > rightIndex) {
          updatedNumbers[rightIndex] = result;
          updatedNumbers[leftIndex] = "";
          setHiddenIndices((prevHiddenIndices) => [
            ...prevHiddenIndices,
            leftIndex,
          ]);
        } else {
          updatedNumbers[leftIndex] = result;
          updatedNumbers[rightIndex] = "";
          setHiddenIndices((prevHiddenIndices) => [
            ...prevHiddenIndices,
            rightIndex,
          ]);
        }

        // Deselect tiles/operation and update numbers
        setSelectedTileIndices([]);
        setNumbers(updatedNumbers);
        setOperation(null);

        // Update best attempt, if closer to target than current best
        if (
          !bestAttempt ||
          Math.abs(result - targetScore) < Math.abs(bestAttempt - targetScore)
        ) {
          setBestAttempt(result);
        }
      } else {
        // Deselect if calculation is not positive integer
        setSelectedTileIndices([]);
        setOperation(null);
      }
    }
  };

  const tileClickHandler = (index) => {
    if (
      selectedTileIndices.length === 2 &&
      !selectedTileIndices.includes(index)
    ) {
      // If there are already two tiles selected and the clicked tile is not one of them, do nothing
      return;
    }

    // Toggle selected tiles
    setSelectedTileIndices((prevSelectedIndices) => {
      const updatedIndices = prevSelectedIndices.includes(index)
        ? prevSelectedIndices.filter((i) => i !== index)
        : [...prevSelectedIndices, index];

      // Calculate, if 2 tiles and operation are selected (as above)
      if (updatedIndices.length === 2 && operation) {
        const [leftIndex, rightIndex] = updatedIndices;
        const x = numbers[leftIndex];
        const y = numbers[rightIndex];
        const result = calculation(operation, x, y);

        if (result !== null && Number.isInteger(result)) {
          setUndoState((prev) => [...prev, { numbers, hiddenIndices }]);

          const updatedNumbers = [...numbers];

          if (leftIndex > rightIndex) {
            updatedNumbers[rightIndex] = result;
            updatedNumbers[leftIndex] = "";
            setHiddenIndices((prevHiddenIndices) => [
              ...prevHiddenIndices,
              leftIndex,
            ]);
          } else {
            updatedNumbers[leftIndex] = result;
            updatedNumbers[rightIndex] = "";
            setHiddenIndices((prevHiddenIndices) => [
              ...prevHiddenIndices,
              rightIndex,
            ]);
          }

          setSelectedTileIndices([]);
          setNumbers(updatedNumbers);
          setOperation(null);

          if (
            !bestAttempt ||
            Math.abs(result - targetScore) < Math.abs(bestAttempt - targetScore)
          ) {
            setBestAttempt(result);
          }
        } else {
          setSelectedTileIndices([]);
          setOperation(null);
        }
      }
      return updatedIndices;
    });
  };

  // Clear all calculations and selections (clear button)
  const clearHandler = () => {
    setNumbers(initialNumbers);
    setHiddenIndices([]);
    setSelectedTileIndices([]);
    setOperation(null);
    setUndoState([]);
  };

  // Undo last calculation
  const undoHandler = () => {
    if (undoState.length > 0) {
      const prevUndoState = undoState[undoState.length - 1];
      setUndoState((prev) => prev.slice(0, -2));

      setNumbers(prevUndoState.numbers);
      setHiddenIndices(prevUndoState.hiddenIndices);
      setSelectedTileIndices([]);
      setOperation(null);
    }
  };

  // End of round - set score for round and reset states
  const endRoundHandler = useCallback(() => {
    setTimerRunning(false);
    setRoundEnd(true);
    setHiddenIndices([]);
    setNumbers(initialNumbers);
    setSelectedTileIndices([]);
    setOperation(null);
    setScore(
      bestAttempt === targetScore
        ? 10
        : Math.abs(bestAttempt - targetScore) < 6
        ? 7
        : Math.abs(bestAttempt - targetScore) < 11
        ? 5
        : 0
    );
  }, [bestAttempt, initialNumbers, targetScore]);

  // 30 second timer
  useEffect(() => {
    let timer = null;

    if (timerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      endRoundHandler();
    }
    return () => clearTimeout(timer);
  }, [
    timerRunning,
    timeRemaining,
    bestAttempt,
    targetScore,
    initialNumbers,
    endRoundHandler,
  ]);

  // Return to menu button
  const menuButton = (event) => {
    event.preventDefault();
    resetState();
    history.push("/menu");
  };

  // Move to next round button
  const nextRoundButton = (event) => {
    event.preventDefault();

    // Update overall scores
    setMax((currentMax) => currentMax + 10);
    setTotal((currentTotal) =>
      bestAttempt === targetScore
        ? currentTotal + 10
        : Math.abs(bestAttempt - targetScore) < 6
        ? currentTotal + 7
        : Math.abs(bestAttempt - targetScore) < 11
        ? currentTotal + 5
        : currentTotal
    );

    // Determine next round (typically letters, unless final number round)
    let nextRound;
    if (
      game.type === "mini" ||
      (game.type === "short" && game.numbers === 2) ||
      (game.type === "full" && game.numbers === 4)
    ) {
      nextRound = "conundrum";
    } else {
      nextRound = "letters";
    }

    setGame({
      ...game,
      round: game.round + 1,
      numbers: game.numbers + 1,
      nextRound,
      roundStart: true,
    });
  };

  // Map numbers drawn to a tile. Should be clickable only when the timer is running
  const tiles = numbers.map((number, index) => (
    <NumberTile
      key={index}
      value={number}
      isVisible={!hiddenIndices.includes(index)}
      clickable={timerRunning}
      isSelected={selectedTileIndices.includes(index)}
      onClick={() => tileClickHandler(index)}
    />
  ));

  return (
    <div className="d-flex flex-column justify-content-center border border-light border-2 rounded rounded-3 p-5 mt-5">
      <h3 className="text-white fs-2 text-center pb-3">
        NUMBERS ROUND {roundNum} of {totalRounds}
      </h3>
      <div className="d-flex justify-content-around pb-3 px-5">
        <table
          className="table table-bordered table-transparent"
          style={{ width: "110px" }}
        >
          <thead>
            <tr>
              <th
                className="fs-4"
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  color: "white",
                  fontFamily: "MS Trebuchet",
                  width: "110px",
                }}
              >
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="fs-4"
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  color: "white",
                  fontFamily: "MS Trebuchet",
                  width: "110px",
                }}
              >
                {targetScore}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="time-remaining text-white fs-4 text-center">
          Time Remaining: {timeRemaining} seconds
        </div>
        <table
          className="table table-bordered table-transparent"
          style={{ width: "110px" }}
        >
          <thead>
            <tr>
              <th
                className="fs-4"
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  color: "white",
                  fontFamily: "MS Trebuchet",
                  width: "110px",
                }}
              >
                Best
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="fs-4"
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  color: "white",
                  fontFamily: "MS Trebuchet",
                  width: "110px",
                }}
              >
                {bestAttempt}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex mx-5 justify-content-center">
        <div className="numbers-bg border border-light d-flex gap-2 px-3 pt-3">
          {tiles}
        </div>
      </div>
      {chooseNumbers && (
        <>
          <div className="time-remaining text-white fs-4 text-center">
            Choose Number Tiles:
          </div>
          <div className="d-flex justify-content-center gap-3 p-3 pb-0">
            <button
              className="btn btn-primary equal-size-btn"
              onClick={() => chooseTiles(4)}
            >
              4 Large / 2 Small
            </button>
            <button
              className="btn btn-primary equal-size-btn"
              onClick={() => chooseTiles(3)}
            >
              3 Large / 3 Small
            </button>
            <button
              className="btn btn-primary equal-size-btn"
              onClick={() => chooseTiles(2)}
            >
              2 Large / 4 Small
            </button>
          </div>
          <div className="d-flex justify-content-center gap-3 p-3 pt-0">
            <button
              className="btn btn-primary equal-size-btn"
              onClick={() => chooseTiles(1)}
            >
              1 Large / 5 Small
            </button>
            <button
              className="btn btn-primary equal-size-btn"
              onClick={() => chooseTiles(0)}
            >
              0 Large / 6 Small
            </button>
          </div>
        </>
      )}
      {getTarget && (
        <div className="d-flex justify-content-center gap-3 p-3 pb-0">
          <button
            className="btn btn-lg btn-primary equal-size-btn"
            onClick={targetHandler}
          >
            Get Target and Start Round
          </button>
        </div>
      )}
      {timerRunning && (
        <>
          <div className="d-flex justify-content-center gap-3 p-3 pb-0 pt-0 operation-buttons-container">
            <button
              className={`btn fs-4 ${
                operation === "+" ? "correct btn-primary" : "btn-primary"
              }`}
              onClick={() => operationHandler("+")}
            >
              +
            </button>
            <button
              className={`btn fs-4 ${
                operation === "-" ? "correct btn-primary" : "btn-primary"
              }`}
              onClick={() => operationHandler("-")}
            >
              -
            </button>
            <button
              className={`btn fs-4 ${
                operation === "*" ? "correct btn-primary" : "btn-primary"
              }`}
              onClick={() => operationHandler("*")}
            >
              x
            </button>
            <button
              className={`btn fs-4 ${
                operation === "/" ? "correct btn-primary" : "btn-primary"
              }`}
              onClick={() => operationHandler("/")}
            >
              &divide;
            </button>
          </div>
          <div className="d-flex justify-content-center gap-3 p-3 pb-0">
            <button
              className="btn btn-secondary equal-size-btn"
              onClick={clearHandler}
            >
              Clear
            </button>
            <button
              className="btn btn-secondary equal-size-btn"
              onClick={undoHandler}
            >
              Undo
            </button>
            <button
              className="btn btn-danger equal-size-btn"
              onClick={endRoundHandler}
            >
              End Round
            </button>
          </div>
        </>
      )}
      {roundEnd && (
        <>
          <div className="time-remaining text-white fs-3 text-center">
            You scored {score} points.
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center gap-2">
            {game.type === "numbers" ? (
              <button className="btn btn-primary btn-lg" onClick={menuButton}>
                Return to Menu
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={nextRoundButton}
              >
                Continue to Next Round
              </button>
            )}
          </div>
        </>
      )}
      {roundEnd && score < 10 && !isTargetReachable && (
        <div className="time-remaining text-white fs-5 text-center">
          The target score of {targetScore} was not possible to reach.
        </div>
      )}
      {roundEnd && score < 10 && isTargetReachable && (
        <>
          <div className="time-remaining text-white fs-5 text-center">
            A possible method of reaching the target score of {targetScore} is:
          </div>
          <div>{solution}</div>
        </>
      )}
    </div>
  );
}

export default Numbers;
