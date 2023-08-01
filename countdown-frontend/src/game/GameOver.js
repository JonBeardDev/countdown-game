import React from "react";
import vowels from "../decks/vowels";
import consonants from "../decks/consonants";
import { shuffle } from "../utils/shuffle";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function GameOver({ score, maxScore, setVowels, setConsonants }) {
  const history = useHistory();
  setVowels(shuffle(vowels));
  setConsonants(shuffle(consonants));

  const menuButton = (event) => {
    event.preventDefault();
    history.push("/menu");
  };

  return (
    <div className="d-flex flex-column justify-content-center border border-light border-2 rounded rounded-3 p-5 mt-5">
      <h3 className="text-white fs-2 text-center pb-3">GAME OVER</h3>
      <div className="time-remaining text-white fs-3 text-center">
        You scored a total of {score} out of a possible {maxScore} points.
      </div>
      <div className="d-flex pt-3 mx-5 justify-content-center gap-2">
        <button className="btn btn-primary btn-lg" onClick={menuButton}>
          Return to Menu
        </button>
      </div>
    </div>
  );
}

export default GameOver;
