import React from "react";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "normalize.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
createRoot(root).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
