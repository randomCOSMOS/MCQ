const express = require('express');
const {Client} = require('pg');
const client = new Client({
    user: 'cosmos',
    password: 'o',
    port: 3500,
    host: 'localhost',
    database: 'MCQ'
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

app.post("/sendQuestion", (req, res) => {
    let data = req.body;

    if (data.question !== "") {
        let Question = new questionStore(data.question, data.optionA, data.optionB, data.optionC, data.correct);
        db.insert(Question, (err, doc) => {
            console.log("Inserted " + doc.question + " with ID " + doc._id);
            if (err) {
                console.error(err);
            }
        });

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

app.post("/op", async (req, res) => {
    try {
        await client.connect();
        console.log(`Connected`);
        await client.query("BEGIN");
        await client.query('insert into questions ("questions","optiona") values ($1, $2)', ["djldjld","jflkfjs"] )
        await client.query("COMMIT");
        const {rows} = await client.query("select * from questions");
        console.table(rows);
    } catch (e) {
        console.error("there was an error: " + e)
    } finally {
        await client.end();
        console.log("Disconnected")
    }
});