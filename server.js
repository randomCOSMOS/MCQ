const express = require('express');
const {Client} = require('pg');
require('dotenv').config();
const client = new Client({
    user: process.env.user,
    password: process.env.password,
    port: process.env.pport,
    host: process.env.host,
    database: process.env.database
});
const Datastore = require('nedb');
const db = new Datastore('question.db');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening at ${port}!`));
app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}));

let ok = process.env;
// console.log(ok)

class questionStore {
    constructor(question, optionA, optionB, optionC, correct) {
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.correct = correct;
    }
}

db.loadDatabase();

app.post("/sendQuestion", async (req, res) => {
    let data = req.body;

    if (data.question !== "") {
        // await client.connect();
        await client.query('insert into questions ("questions", "optiona", "optionb", "optionc", "correct") values ($1,$2,$3,$4,$5)',
            [data.question, data.optionA, data.optionB, data.optionC, data.correct]);
        console.log(`Added`);
        // await client.query('COMMIT');

        res.json({
            status: "Success"
        });
    } else {
        res.json({
            status: "No question"
        });
    }
});

app.get("/clearDatabase", (req, res) => {
    db.remove({}, {
            multi: true
        },
        (err, numRemoved) => {

            if (err) {
                res.json({
                    err
                });
            } else {
                res.send("Cleared " + numRemoved + " entries");
                console.log("Data Base Cleared");
            }

        })
});

let score = 0;

app.post("/check", (req, res) => {
    score = 0;
    let data = req.body;
    for (let arrays of data) {
        db.find({question: arrays[0]}, (err, doc) => {
            let correctAnswer = doc[0].correct;
            let yourAnswer = arrays[1];
            if (yourAnswer === correctAnswer) {
                score++;
            }
            console.log("");
            console.log(score);
            console.log("Correct answer: " + correctAnswer);
            console.log("Your Answer: " + yourAnswer);
        });
    }
    client.end();
    console.log('Disconnected!')
    res.send("ok");
});

app.get("/sendQuestion", (req, res) => {
    db.find({}, (err, doc) => {
        res.json(doc);
    });
});

app.get("/getScore", (req, res) => {
    res.json({score});
});

app.post('/op', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected");
    }catch (e) {
        console.log(`Something wnt wrong ${e}`)
    }
});

