const express = require('express');
const {Pool} = require('pg');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

let pool;

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
} else {
    pool = new Pool({
        user: process.env.D_user,
        password: process.env.D_password,
        port: process.env.D_pport,
        host: process.env.D_host,
        database: process.env.D_database
    });
}

app.listen(port, () => console.log(`Server listening at ${port}!`));
app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}));

app.post("/sendQuestion", async (req, res) => {
    let data = req.body;

    if (data.question !== "") {
        await pool.query(`insert into ${process.env.D_table} ("questions", "optiona", "optionb", "optionc", "correct") values ($1,$2,$3,$4,$5)`,
            [data.question, data.optionA, data.optionB, data.optionC, data.correct]);
        console.log(`Added`);

        res.json({
            status: "Success"
        });
    } else {
        res.json({
            status: "No question"
        });
    }
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
    pool.end();
    console.log('Disconnected!');
    res.send("ok");
});

app.get("/sendQuestion", async (req, res) => {
    const data = req.body;
    const {rows} = await pool.query('select * from questions');
    res.json(rows);
});

app.get("/getScore", (req, res) => {
    res.json({score});
});

app.get('/op', async (req, res) => {

});
