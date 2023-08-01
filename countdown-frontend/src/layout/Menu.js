import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Menu.css";

function Menu() {
  const history = useHistory();

  const initialText = {
    header: "Full Game",
    description: "10 Letters rounds, 4 Numbers rounds, and 1 Conundrum",
  };

  const [text, setText] = useState(initialText);
  const [game, setGame] = useState("full");

  const changeHandler = (event) => {
    const { value } = event.target;

    switch (value) {
      case "short":
        setGame("short");
        setText({
          header: "Short Game",
          description: "6 Letters rounds, 2 Numbers rounds, and 1 Conundrum",
        });
        break;
      case "mini":
        setGame("mini");
        setText({
          header: "Mini Game",
          description: "1 Letters round, 1 Numbers round, and 1 Conundrum",
        });
        break;
      case "letters":
        setGame("letters");
        setText({
          header: "Letters Game",
          description: "1 Letters round",
        });
        break;
      case "numbers":
        setGame("numbers");
        setText({
          header: "Numbers Game",
          description: "1 Numbers round",
        });
        break;
      case "conundrum":
        setGame("conundrum");
        setText({
          header: "Countdown Conundrum",
          description: "1 Conundrum",
        });
        break;
      default:
        setGame("full");
        setText({
          header: "Full Game",
          description: "10 Letters rounds, 4 Numbers rounds, and 1 Conundrum",
        });
    }
  };

  const startHandler = (event) => {
    event.preventDefault();
    history.push(`/game/${game}`);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="form-check">
            <fieldset>
              <legend className="p-2">Game Type</legend>
              <div className="mx-5">
                <input
                  type="radio"
                  id="full"
                  name="types"
                  value="full"
                  checked={game === "full"}
                  onChange={changeHandler}
                />
                <label htmlFor="full">Full Game</label>
              </div>
              <div className="mx-5">
                <input
                  type="radio"
                  id="short"
                  name="types"
                  value="short"
                  onChange={changeHandler}
                />
                <label htmlFor="short">Short Game</label>
              </div>
              <div className="mx-5">
                <input
                  type="radio"
                  id="mini"
                  name="types"
                  value="mini"
                  onChange={changeHandler}
                />
                <label htmlFor="mini">Mini Game</label>
              </div>
              <div className="mx-5">
                <input
                  type="radio"
                  id="letters"
                  name="types"
                  value="letters"
                  onChange={changeHandler}
                />
                <label htmlFor="letters">Letters Game</label>
              </div>
              <div className="mx-5">
                <input
                  type="radio"
                  id="numbers"
                  name="types"
                  value="numbers"
                  onChange={changeHandler}
                />
                <label htmlFor="numbers">Numbers Game</label>
              </div>
              <div className="mx-5">
                <input
                  type="radio"
                  id="conundrum"
                  name="types"
                  value="conundrum"
                  onChange={changeHandler}
                />
                <label htmlFor="conundrum">Conundrum</label>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-center">
          <div>
            <h2 className="text-white fs-1">{text.header}</h2>
          </div>
          <div>
            <p className="text-white fs-4">{text.description}</p>
          </div>
          <div>
            <button
              className="btn btn-lg btn-primary px-5"
              type="button"
              onClick={startHandler}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
