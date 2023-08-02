import React, { useState, useEffect } from "react";
import "./Game.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Tile from "./Tile";
import SavedWords from "./SavedWords";
import { lookupWord, getBest, getAll } from "../utils/anagramAPI";
import vowels from "../decks/vowels";
import consonants from "../decks/consonants";

function Letters({
  game,
  setGame,
  setTotal,
  setMax,
  vowelsDeck,
  setVowels,
  consonantsDeck,
  setConsonants,
}) {
  const history = useHistory();
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [currentWord, setCurrentWord] = useState(Array(9).fill(""));
  const [savedWords, setSavedWords] = useState([]);
  const [letters, setLetters] = useState(Array(9).fill(""));
  const [drawn, setDrawn] = useState(0);
  const [numVowels, setNumVowels] = useState(0);
  const [numConsonants, setNumConsonants] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [chooseFinalWord, setChooseFinalWord] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validWord, setValidWord] = useState(0);
  const [bestWord, setBestWord] = useState("");
  const [bestWordArr, setBestWordArr] = useState(Array(9).fill(""));
  const [allWords, setAllWords] = useState(null);
  const [allForDisplay, setAllForDisplay] = useState(null);

  // For displaying letters round numbers (round x of y)
  const roundNum = game.letters;
  let totalRounds;
  switch (game.type) {
    case "full":
      totalRounds = 10;
      break;
    case "short":
      totalRounds = 6;
      break;
    default:
      totalRounds = 1;
  }

  // Add letter to new guessed word by clicking tile
  const clickHandler = (event, letter, index) => {
    event.preventDefault();

    // Find the next empty tile in the user's current word and add the letter to that tile
    const emptyIndex = currentWord.findIndex((tile) => tile === "");
    if (emptyIndex >= 0 && emptyIndex < 9) {
      const newWord = [...currentWord];
      newWord[emptyIndex] = letter;
      setCurrentWord(newWord);
    }

    // Hide the letter in the available letters so it cannot be used again.
    setHiddenIndices((prevHiddenIndices) => [...prevHiddenIndices, index]);
  };

  // Draw next vowel from deck and add to available letters in the next available tile.
  const vowelHandler = (event) => {
    event.preventDefault();

    if (numVowels >= 5) {
      window.alert("No more than 5 vowels may be used in a Letters Round.");
    } else {
      // Draw next vowel
      const nextVowel = vowelsDeck.pop();

      // Find and update next empty tile
      const emptyIndex = letters.findIndex((tile) => tile === "");
      const updatedLetters = [...letters];
      updatedLetters[emptyIndex] = nextVowel;
      setLetters(updatedLetters);

      // Update deck so that specific popped vowel card is removed for subsequent rounds
      setVowels(vowelsDeck);

      // Add 1 to the number of cards and vowels drawn (game starts when 9 cards are drawn)
      setDrawn((current) => current + 1);
      setNumVowels((current) => current + 1);

      if (drawn === 8) {
        setTimerRunning(true); // Start the timer when the 9th letter is drawn
      }
    }
  };

  // Draw next consonant from deck and add to available letters in the next available tile.
  const consonantHandler = (event) => {
    event.preventDefault();

    if (numConsonants >= 6) {
      window.alert("No more than 6 consonants may be user in a Letters Round.");
    } else {
      //Draw next consonant
      const nextConsonant = consonantsDeck.pop();

      // Find and update next empty tile
      const emptyIndex = letters.findIndex((tile) => tile === "");
      const updatedLetters = [...letters];
      updatedLetters[emptyIndex] = nextConsonant;
      setLetters(updatedLetters);

      // Update deck so that specific popped consonant card is removed for subsequent rounds
      setConsonants(consonantsDeck);

      // Add 1 to the number of cards and consonants drawn (game starts when 9 cards are drawn)
      setDrawn((current) => current + 1);
      setNumConsonants((current) => current + 1);

      if (drawn === 8) {
        setTimerRunning(true); // Start the timer when the 9th letter is drawn
      }
    }
  };

  // Clear current word
  const clearHandler = (event) => {
    event.preventDefault();

    // Unhide all hidden tiles and set current word to empty
    setHiddenIndices([]);
    setCurrentWord(Array(9).fill(""));
  };

  // Save current word
  const saveHandler = (event) => {
    event.preventDefault();

    // Join current word and trim spaces from end
    const newWord = currentWord.join("").trim();

    if (newWord.length > 2) {
      // Adjust capitalization for display purposes
      const lowerCase = newWord.toLowerCase();
      const capitalized =
        lowerCase.charAt(0).toUpperCase() + lowerCase.substring(1);

      // Save current word, if not already in saved words
      if (!savedWords.includes(capitalized)) {
        setSavedWords([...savedWords, capitalized]);
      }

      // Unhide all hidden tiles and set current word to empty
      setHiddenIndices([]);
      setCurrentWord(Array(9).fill(""));
    }
  };

  // Delete last letter from current word. Unhide letter in available letters
  const deleteHandler = (event) => {
    event.preventDefault();

    if (hiddenIndices.length) {
      let lastFilledIndex = 8;
      if (currentWord.includes("")) {
        lastFilledIndex = currentWord.indexOf("") - 1;
      }

      const updatedWord = [...currentWord];
      updatedWord[lastFilledIndex] = "";
      setCurrentWord(updatedWord);

      hiddenIndices.pop();
      setHiddenIndices(hiddenIndices);
    }
  };

  // Set final word choice for submission. Use API to check word is in the dictionary.
  const wordChooser = async (word) => {
    const wordArray = word.toUpperCase().split("");
    const chosenWord = Array(9).fill("");

    for (let i = 0; i < wordArray.length && i < 9; i++) {
      chosenWord[i] = wordArray[i];
    }

    setCurrentWord(chosenWord);

    try {
      const found = await lookupWord(word.toLowerCase());
      setValidWord(found);
    } catch {
      console.error("Error occurred while looking up word.");
    }
  };

  // Submit final word
  const submitHandler = async (event) => {
    event.preventDefault();
    setChooseFinalWord(false);
    setSubmitted(true);
  };

  // When all 9 cards are drawn, API call to find best and all possible words.
  useEffect(() => {
    if (drawn === 9) {
      const fetchData = async () => {
        try {
          const [best, all] = await Promise.all([
            getBest(letters),
            getAll(letters),
          ]);
          setBestWord(best[0]);
          setAllWords(all);
        } catch (error) {
          console.error(
            "Error occurred while looking up best possible words:",
            error
          );
        }
      };

      fetchData();
    }
  }, [drawn, letters]);

  // When best word API promise returned, prep Best Word tiles for end of round display
  useEffect(() => {
    if (bestWord.length) {
      const bestTiles = Array(9).fill("");
      const bestLetters = bestWord.toUpperCase().split("");

      for (let i = 0; i < bestLetters.length && i < 9; i++) {
        bestTiles[i] = bestLetters[i];
      }

      setBestWordArr(bestTiles);
    }
  }, [bestWord]);

  // When all words API promise returned, prep table of all words for end of round display
  useEffect(() => {
    if (allWords) {
      const allCapitalized = allWords.map(
        (word) => word.charAt(0).toUpperCase() + word.substring(1)
      );
      setAllForDisplay(allCapitalized);
    }
  }, [allWords]);

  // Start 30 second timer. Choose final word when time up (or go to end of round if no words have been saved)
  useEffect(() => {
    let timer = null;

    if (timerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerRunning(false);
      setCurrentWord(Array(9).fill(""));
      setHiddenIndices([]);

      if (savedWords.length > 0) {
        setChooseFinalWord(true);
      } else {
        setSubmitted(true);
      }
    }

    return () => clearTimeout(timer);
  }, [timerRunning, timeRemaining, savedWords]);

  // Return to main menu at end of single letters game. Reset both letters decks to initial deck.
  const menuButton = (event) => {
    event.preventDefault();
    setVowels(vowels);
    setConsonants(consonants);
    history.push("/menu");
  };

  // Add to game and max possible score. Set game object prop to move to next round.
  const nextRoundButton = (event) => {
    event.preventDefault();

    setMax((currentMax) => currentMax + bestWord.length);
    setTotal((currentTotal) =>
      validWord && currentWord.join("").trim().length === 9
        ? currentTotal + 18
        : validWord && currentWord.join("").trim().length < 9
        ? currentTotal + currentWord.join("").trim().length
        : currentTotal
    );

    let nextRound;
    if (game.type === "mini") {
      nextRound = "numbers";
    } else if (game.type === "full") {
      if (
        game.round === 2 ||
        game.round === 5 ||
        game.round === 8 ||
        game.round === 13
      ) {
        nextRound = "numbers";
      } else {
        nextRound = "letters";
      }
    }
    if (game.type === "short") {
      if (game.round === 3 || game.round === 7) {
        nextRound = "numbers";
      } else {
        nextRound = "letters";
      }
    }

    setGame({
      ...game,
      round: game.round + 1,
      letters: game.letters + 1,
      nextRound,
      roundStart: true,
    });
  };

  // Map letters drawn from deck to a tile. Should be clickable only when timer is running
  const tiles = letters.map((letter, index) => (
    <Tile
      key={index}
      value={letter}
      isVisible={!hiddenIndices.includes(index)}
      onClick={(event) => clickHandler(event, letter, index)}
      clickable={timerRunning}
    />
  ));

  // Map each letter in the user's current word to a tile. Should never be clickable
  const userGuessTiles = currentWord.map((letter, index) => (
    <Tile
      key={index}
      value={letter}
      isVisible={letter}
      clickable={false}
      isCorrect={submitted && validWord}
      isIncorrect={submitted && !validWord}
    />
  ));

  // Map each letter in the best possible word to a tile. Should never be clickable
  const bestWordTiles = bestWordArr.map((letter, index) => (
    <Tile key={index} value={letter} isVisible={letter} clickable={false} />
  ));

  return (
    <div className="d-flex flex-column justify-content-center border border-light border-2 rounded rounded-3 p-5 mt-5">
      <h3 className="text-white fs-2 text-center pb-3">
        LETTERS ROUND {roundNum} of {totalRounds}
      </h3>
      {drawn < 9 && (
        <div className="time-remaining text-white fs-4 text-center">
          Draw Letter Tiles:
        </div>
      )}
      {drawn === 9 && (
        <div className="time-remaining text-white fs-4 text-center">
          Time Remaining: {timeRemaining} seconds
        </div>
      )}
      {chooseFinalWord && (
        <div className="time-remaining text-white fs-4 text-center">
          Choose word to submit from your saved words:
        </div>
      )}
      {!chooseFinalWord && (
        <div className="d-flex pt-3 mx-5 justify-content-center">
          <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
            {tiles}
          </div>
        </div>
      )}
      {drawn < 9 && (
        <div className="d-flex justify-content-center gap-3 p-3">
          <button
            className="btn btn-primary btn-lg equal-size-btn"
            onClick={vowelHandler}
          >
            Draw Vowel
          </button>
          <button
            className="btn btn-primary btn-lg equal-size-btn"
            onClick={consonantHandler}
          >
            Draw Consonant
          </button>
        </div>
      )}
      {submitted && (
        <div className="time-remaining text-white fs-4 text-center">
          Your Word:
        </div>
      )}
      {drawn === 9 && (
        <>
          <div className="d-flex pt-3 mx-5 justify-content-center">
            <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
              {userGuessTiles}
            </div>
          </div>
        </>
      )}
      {chooseFinalWord && (
        <div className="d-flex justify-content-center gap-3 p-3">
          <button
            className="btn btn-primary btn-lg equal-size-btn"
            onClick={submitHandler}
          >
            Submit Word
          </button>
        </div>
      )}
      {drawn === 9 && !chooseFinalWord && !submitted && (
        <>
          <div className="d-flex justify-content-center gap-3 p-3">
            <button
              className="btn btn-danger btn-lg equal-size-btn"
              onClick={clearHandler}
            >
              Clear Current Word
            </button>
            <button
              className="btn btn-danger btn-lg equal-size-btn"
              onClick={deleteHandler}
            >
              Delete Last Letter
            </button>
            <button
              className="btn btn-primary btn-lg equal-size-btn"
              onClick={saveHandler}
            >
              Save Current Word
            </button>
          </div>
        </>
      )}
      {drawn === 9 && !submitted && (
        <>
          <h3 className="text-white fs-4 text-center pb-3">Saved Words</h3>
          <div className="d-flex pt-3 mx-5 justify-content-center">
            <SavedWords
              savedWords={savedWords}
              wordClickHandler={wordChooser}
              clickable={chooseFinalWord}
            />
          </div>
        </>
      )}
      {submitted && (
        <>
          <div className="time-remaining text-white fs-4 text-center">
            Best Available Word:
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center">
            <div className="letters-bg border border-light d-flex gap-2 px-3 pt-3">
              {bestWordTiles}
            </div>
          </div>
          <div className="time-remaining text-white fs-3 text-center">
            You scored{" "}
            {validWord && currentWord.join("").trim().length === 9
              ? 18
              : validWord && currentWord.join("").trim().length < 9
              ? currentWord.join("").trim().length
              : 0}{" "}
            points out of {bestWord.length === 9 ? 18 : bestWord.length}{" "}
            available.
          </div>
          <div className="time-remaining text-white fs-4 text-center">
            Other possible words:
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center">
            <SavedWords
              savedWords={allForDisplay}
              wordClickHandler={wordChooser}
              clickable={false}
            />
          </div>
          <div className="d-flex pt-3 mx-5 justify-content-center gap-2">
            {game.type === "letters" ? (
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
    </div>
  );
}

export default Letters;
