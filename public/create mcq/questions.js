const name = (name) => {
    return 'input[name="' + name + '"]';
};

const formSubmitted = async () => {
    let question = $(name("questions")).val();
    let optionA = $(name("optiona")).val();
    let optionB = $(name("optionb")).val();
    let optionC = $(name("optionc")).val();
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

const op = async () => {
    const response = await fetch('/op');
    const data = await response.json();
    console.table(data);
};