const showQuestion = async () => {
    let Question, optionA, optionB, optionC, correctOption

    const Response = await fetch("/sendQuestion");
    const data = await Response.json();

    console.log(data);
}