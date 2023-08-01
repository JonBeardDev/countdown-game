import React from "react";
import "./SavedWords.css";

function SavedWords({ savedWords, wordClickHandler, clickable }) {
  const wordsByLength = {
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  };

  if (savedWords) {
    savedWords.forEach((word) => {
      if (word.length > 2) {
        wordsByLength[word.length].push(word);
      }
    });
  }

  const renderWords = (words) => {
    return words.map((word, index) => (
      <tr key={index}>
        <td className="table-text" onClick={clickable ? () => wordClickHandler(word) : null}>
          {word}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <table className="table table-bordered table-transparent">
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              3 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              4 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              5 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              6 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              7 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              8 letters
            </th>
            <th
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
                width: "110px",
              }}
            >
              9 letters
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[3])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[4])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[5])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[6])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[7])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[8])}
            </td>
            <td
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                color: "white",
                fontFamily: "MS Trebuchet",
              }}
            >
              {renderWords(wordsByLength[9])}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SavedWords;
