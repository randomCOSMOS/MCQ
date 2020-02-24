const name = (name) => {
    return 'input[name="' + name + '"]';
};

const formSubmitted = async () => {
    let question = $(name("question")).val();
    let optionA = $(name("optionA")).val();
    let optionB = $(name("optionB")).val();
    let optionC = $(name("optionC")).val();
    let correct = $("#correctOption").val();

    $("#question, #options, #correctOption").val("");

    let mcq = {
        question,
        optionA,
        optionB,
        optionC,
        correct
    };

    const details = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mcq)
    };

    const Response = await fetch('/sendQuestion', details);
    try {
        const {status} = await Response.json();
        if (status === "Success") {
            alert("Success")
        } else {
            alert("Please enter a question")
        }
    } catch (e) {
        console.error(`There was an error sending the question ${e}`)
    }

    const Questions = await fetch('/sendQuestion');
    const questionJson = await Questions.json();
    console.log(questionJson);
};

const clearDatabase = async () => {
    const Response = await fetch("/clearDatabase");
    try {
        const text = await Response.text();
        console.log(text);
    } catch (e) {
        console.error('Receiving response for clearing database: ' + e);
    }
};

const op = () => {
    fetch('/op', {method: "POST"})
};