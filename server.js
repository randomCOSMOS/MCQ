// requiring stuff
const express = require('express');
const {Pool} = require('pg');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

let pool, score = 0;

// connecting to data base
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

// starting server
app.listen(port, () => console.log(`Server listening at ${port}!`));
app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}));

// post requests
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

app.post("/check", async (req, res) => {
    score = 0;
    let data = req.body;
    for (let array of data){
        console.log(array);
        let {rows} = await pool.query(`select correct from ${process.env.D_table} where questions=$1`, [array[0]]);
        let {correct} = rows[0];
        console.log(correct);
        if (array[1] === correct){
            score++
        }
    }
    res.json({score});
});

// get requests
app.get("/sendQuestion", async (req, res) => {
    const {rows} = await pool.query('select * from questions');
    res.json(rows);
});

app.get("/getScore", (req, res) => {
    res.json({score});
});