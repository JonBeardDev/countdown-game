import React from "react";

function NumberTile({ value, onClick, isVisible, clickable, isSelected }) {
  const handleClick = (event) => {
    if (isVisible && clickable) {
      onClick(event);
    }
  };

  const getTileClassName = () => {
    let className = "number-tile ";
    if (isVisible && value) {
      className += "visible";
    } else {
      className += "hidden";
    }
    if (isVisible && isSelected) {
      className += " correct";
    }
    return className;
  };

  return (
    <button type="button" className={getTileClassName()} onClick={handleClick}>
      {value}
    </button>
  );
}

export default NumberTile;
