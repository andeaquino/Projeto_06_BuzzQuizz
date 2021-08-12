const URL_QUIZZ = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes/2";
const newQuizzInfo = {
    title: "",
    imageURL: "",
    numberOfQuestions: 0,
    numberOfLevels: 0
}

function animateButton(thisButton) {
    thisButton.classList.add("selected");
    setTimeout(function() {
        thisButton.classList.remove("selected");
    },80);
}

function createNewQuestions() {
    alert("Deu bom!");
}

function isTitleValid() {
    return (newQuizzInfo.title.length >= 20 && newQuizzInfo.title.length <= 65);
}

function isnumberOfQuestions() {
    return (!isNaN(newQuizzInfo.numberOfQuestions) && newQuizzInfo.numberOfQuestions >= 3);
}

function isnumberOfLevels() {
    return (!isNaN(newQuizzInfo.numberOfLevels) && newQuizzInfo.numberOfLevels >= 2);
}

function checkInputsValidation(forwardButton,isImageUrlValid) {
    if (isTitleValid() && isImageUrlValid && isnumberOfQuestions() && isnumberOfLevels()) {
        createNewQuestions();
    } else {
        alert("Houve um erro na validação dos itens listados! Por favor, tente novamente");
        buttonDisableSwitch(forwardButton);
    }
}

function importInputValues(thisButton) {
    animateButton(thisButton)
    buttonDisableSwitch(thisButton);
    const inputsArea = document.querySelector(".new-quiz-screen .new-basic-info");
    newQuizzInfo.title = inputsArea.querySelector("input:nth-child(1)").value;
    newQuizzInfo.imageURL = inputsArea.querySelector("input:nth-child(2)").value;
    newQuizzInfo.numberOfQuestions = Number(inputsArea.querySelector("input:nth-child(3)").value);
    newQuizzInfo.numberOfLevels = Number(inputsArea.querySelector("input:nth-child(4)").value);
    const UrlCheck = new Image();
    UrlCheck.src = newQuizzInfo.imageURL;
    UrlCheck.addEventListener('load',  function() {
        checkInputsValidation(thisButton,true);
    });
    UrlCheck.addEventListener('error', function() {
        checkInputsValidation(thisButton,false);
    });
}

function buttonDisableSwitch(thisButton) {
    if (thisButton.disabled === false){
        thisButton.disabled = true;
        thisButton.innerHTML = `<img src="media/Button Loading.gif">`
    } else {
        thisButton.disabled = false;
        thisButton.innerHTML = "Prosseguir pra criar perguntas"
    }
}