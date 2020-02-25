let x = 0;
let answers = [];
$(".allQuestions + input").hide();

const showQuestion = async () => {
    $(".allQuestions").empty();

    let question, optionA, optionB, optionC;

    const Response = await fetch("/sendQuestion");
    let data = [];

    try {
        data = await Response.json();
        console.table(data)
    } catch (e) {
        console.warn("Failed to get data!");
        console.error(e);
    }

    if (data.length !== 0) {
        x = 0;
        for (let everyQuestion of data) {
            x++;
            question = everyQuestion.questions;
            optionA = everyQuestion.optionc;
            optionB = everyQuestion.optionb;
            optionC = everyQuestion.optionc;

            const visibleQuestion = "<h3>Q." + question + "</h3>";
            const visibleOptionA = "<h4>a)" + optionA + "</h4>";
            const visibleOptionB = "<h4>b)" + optionB + "</h4>";
            const visibleOptionC = "<h4>c)" + optionC + "</h4>";
            const visibleInput = '<br><h4>Answer:</h4><input type="text" name="answer' + x + '">';
            $(".allQuestions").append(visibleQuestion, visibleOptionA, visibleOptionB, visibleOptionC, visibleInput);
            answers.push([question, ""]);
        }

        $(".allQuestions + input").show();
    } else {
        alert("No questions found");
    }
};

const submitted = async () => {
    for (let y = 1; x >= y; y++) {
        answers[y - 1][1] = $('input[name="answer' + y + '"]').val();
    }

    let details = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
    };

    console.log(answers);

    fetch("/check", details)
        .then(() => check());
};

const check = async () => {
    let finalResult;
    const Response = await fetch("/getScore");
    const json = await Response.json();
    console.log(json);
    json.score > x * 0.8 ? finalResult = "PASS" : finalResult = "FAIL";
    $(".score").html(json.score + "/" + x + "<br><br>Status: " + finalResult);
    $(".result").css({"width": "70vw", "height": "60vh", "opacity": "1"});
    $(".result h1").css("font-size", "100px");
    $(".result p").css("font-size", "60px");
};

$(window).on("click", () => {
    $(".result").css({"width": "0vw", "height": "0vh", "opacity": "0"});
    $(".result h1").css("font-size", '0px');
    $(".result p").css("font-size", "0px");
});

$(document).ready(showQuestion);