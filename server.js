const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "messages.json";

// Iegūt visus ziņojumus
app.get("/api/messages", (req, res) => {
    const data = fs.readFileSync(DB_FILE, "utf8");
    res.send(JSON.parse(data));
});

// Pievienot jaunu ziņu
app.post("/api/messages", (req, res) => {
    let messages = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

    const newMsg = {
        text: req.body.text,
        time: new Date().toLocaleString()
    };

    messages.push(newMsg);
    fs.writeFileSync(DB_FILE, JSON.stringify(messages, null, 2));

    res.send({ status: "ok" });
});

// Server start
app.listen(3000, () => console.log("BBS server running on https://burnatino.onrender.com"));
const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./bbs.db');

db.run(`
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.get('/messages', (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

app.post('/messages', (req, res) => {
  const { author, content } = req.body;
  db.run(
    "INSERT INTO messages (author, content) VALUES (?, ?)",
    [author, content],
    () => res.json({ ok: true })
  );
});

app.listen(3000);
