const express = require('express');
const Datastore = require('nedb');
const db = new Datastore("question.db");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listning at ${port}!`));
app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}));

let score;
let data;

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
    score = 0;
    data = req.body;

    if (data.question != "") {
        Question = new questionStore(data.question, data.optionA, data.optionB, data.optionC, data.correct);
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

app.post("/clearDatabase", (req, res) => {
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
})

app.get("/sendQuestion", (req, res) => {
    db.find({}, (err, doc) => {
        res.json(doc);
    });
});