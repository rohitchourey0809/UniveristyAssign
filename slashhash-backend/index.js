const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proxy endpoint to search universities
app.get("/api/search", async (req, res) => {
  try {
    const response = await axios.get(
      `http://universities.hipolabs.com/search`,
      {
        params: req.query,
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to save favourite university
app.post("/api/favourites", (req, res) => {
  const { name, state_province, web_page } = req.body;
  db.query(
    "INSERT INTO favourites (name, state_province, web_page) VALUES (?, ?, ?)",
    [name, state_province, web_page],
    (err, results) => {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.json({ id: results.insertId });
      }
    }
  );
});

// Endpoint to get all favourite universities
app.get("/api/favourites", (req, res) => {
  db.query("SELECT * FROM favourites", (err, results) => {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
