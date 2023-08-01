import React, { useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import vowels from "../decks/vowels";
import consonants from "../decks/consonants";
import { shuffle } from "../utils/shuffle";
import GameOver from "./GameOver";
import RoundStart from "./RoundStart";
import Letters from "./Letters";
import Numbers from "./Numbers";
import Conundrum from "./Conundrum";

function GameController() {
  const { type } = useParams();

  let initialGame;

  if (type === "numbers") {
    initialGame = {
      type,
      round: 1,
      letters: 1,
      numbers: 1,
      nextRound: "numbers",
      gameOver: false,
      roundStart: true,
    };
  } else if (type === "conundrum") {
    initialGame = {
      type,
      round: 1,
      letters: 1,
      numbers: 1,
      nextRound: "conundrum",
      gameOver: false,
      roundStart: true,
    };
  } else {
    initialGame = {
      type,
      round: 1,
      letters: 1,
      numbers: 1,
      nextRound: "letters",
      gameOver: false,
      roundStart: true,
    };
  }

  const [game, setGame] = useState(initialGame);

  const [vowelsDeck, setVowels] = useState(shuffle(vowels));
  const [consonantsDeck, setConsonants] = useState(shuffle(consonants));

  const [totalScore, setTotal] = useState(0);
  const [maxScore, setMax] = useState(0);

  let displayGame;

  if (game.gameOver) {
    displayGame = (
      <GameOver
        score={totalScore}
        maxScore={maxScore}
        setVowels={setVowels}
        setConsonants={setConsonants}
      />
    );
  } else if (game.roundStart) {
    displayGame = <RoundStart game={game} setGame={setGame} />;
  } else if (game.nextRound === "letters") {
    displayGame = (
      <Letters
        game={game}
        setGame={setGame}
        setTotal={setTotal}
        setMax={setMax}
        vowelsDeck={vowelsDeck}
        setVowels={setVowels}
        consonantsDeck={consonantsDeck}
        setConsonants={setConsonants}
      />
    );
  } else if (game.nextRound === "numbers") {
    displayGame = (
      <Numbers
        game={game}
        setGame={setGame}
        setTotal={setTotal}
        setMax={setMax}
      />
    );
  } else {
    displayGame = (
      <Conundrum
        game={game}
        setGame={setGame}
        setTotal={setTotal}
        setMax={setMax}
      />
    );
  }

  const gameName = `${game.type.toUpperCase()} GAME`;
  let totalRounds = 1;
  if (game.type === "full") totalRounds = 15;
  else if (game.type === "short") totalRounds = 9;
  else if (game.type === "mini") totalRounds = 3;

  return (
    <div className="m-4 p-5">
      <div className="mx-5">
        <h2 className="text-white fs-1">{gameName}</h2>
        <h3 className="text-white fs-2">
          Round {game.round} of {totalRounds}
        </h3>
        <div className="m-3">{displayGame}</div>
      </div>
    </div>
  );
}

export default GameController;
