import React from "react";

function Tile({
  value,
  onClick,
  isVisible,
  isCorrect,
  isIncorrect,
  clickable,
}) {
  const handleClick = (event) => {
    if (isVisible && clickable) {
      onClick(event);
    }
  };

  const getTileClassName = () => {
    let className = "tile ";
    if (isVisible && value) {
      className += "visible ";
      if (isCorrect) {
        className += "correct";
      }
      if (isIncorrect) {
        className += "incorrect";
      }
    } else {
      className += "hidden";
    }
    return className;
  };

  return (
    <button type="button" className={getTileClassName()} onClick={handleClick}>
      {value ? value.toUpperCase() : value}
    </button>
  );
}

export default Tile;
