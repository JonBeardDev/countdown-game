import React from "react";
import "./Header.css";
import bgImage from "../images/header-bg.png";

/**
 * Displays the header jumbotron and navbar (via Menu component)
 * @returns {JSX.Element}
 */
function Header() {
  const letters = ["C", "O", "U", "N", "T", "D", "O", "W", "N"];

  return (
    <header className="header" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="header-tiles">
        {letters.map((letter, index) => (
          <div className="header-tile" key={index}>
            {letter}
          </div>
        ))}
      </div>
    </header>
  );
}

export default Header;
