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
app.listen(3000, () => console.log("BBS server running on http://localhost:3000"));
