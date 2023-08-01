const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/api/anagramica/:endpoint/:param", async (req, res) => {
  const { endpoint, param } = req.params;
  const apiUrl = `http://www.anagramica.com/${endpoint}/${param}`;

  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from the API" });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});