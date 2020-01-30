const name = (name) => {
    let inputName =  'input[name="' + name + '"]';
    return inputName;
};

const formSubmitted = () => {
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

    fetch("/sendQuestion", details)
        .then(Response => Response.json())
        .then(json => {
            if (json.status == "Success") {
                alert("Success");
            }else{
                alert("Please enter a Question!");
            }
        })
        .catch(err => console.error("Error in post: " + err));

    fetch("/sendQuestion")
        .then(Response => Response.json())
        .then(json => console.log(json))
        .catch(err => console.error("Error in get: " + err));
};

const clearDatabase = () => {
    fetch("/clearDatabase", {
            method: "POST"
        })
        .then(Response => Response.text())
        .then(json => console.log(json))
        .catch(err => console.error("Error in clearing Data Base: " + err));
}