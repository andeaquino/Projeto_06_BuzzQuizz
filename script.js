const URL_QUIZZ = `https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes`;
const newQuizzInfo = {
    title: "",
    imageURL: "",
    numberOfQuestions: 0,
    numberOfLevels: 0
}

function thumbStructure(element) {
    return `<li class="quiz-thumb" onclick="playQuizz(${element.id})">
                <div class="thumb grad"></div>
                <img src="${element.image}" alt="Test Image">
                <h2 class="quiz-thumb-title">${element.title}</h2>
            </li>`;
}

function updateQuizzes(promise) {
    let text = "";
    for(i = 0; i < promise.data.length; i++) {
        text += thumbStructure(promise.data[i]);
    }
    document.querySelector(".list-of-all-quizzes ul").innerHTML = text;
}

function getServerQuizzes() {
    const promise = axios.get(URL_QUIZZ);
    promise.then(updateQuizzes);
}

function randomize() { 
	return Math.random() - 0.5; 
}

function switchToQuizzPage(quiz) {
    const title = document.querySelector(".quiz-title");
    title.innerText = quiz.data.title;
    const banner = document.querySelector(".banner-image");
    banner.src = quiz.data.image;
    const questions = document.querySelector(".quiz-questions");
    questions.innerHTML = "";

    for (let i = 0; i < quiz.data.questions.length; i++) {
        let randomAnswers = quiz.data.questions[i].answers.sort(randomize);
        answers = ""
        
        for (let j = 0; j < randomAnswers.length; j++) {
            answers += 
            `<li class="option">
                <img src="${randomAnswers[j].image}" alt="Option Imagem">
                <span>${randomAnswers[j].text}</span>
            </li>`;
        }

        questions.innerHTNL = 
        `<section class="question">
            <header class="question-title" style="background-color:${quiz.data.questions[i].color}">${quiz.data.questions[i].title}</header>
            <ul class="answers">
                ${answers}
            </ul>
        </section>`;
    }
    
    document.querySelector(".quiz-list").classList.add("hidden");
    document.querySelector(".quiz-page").classList.remove("hidden");
}

function playQuizz(quizID) {
    const promise = axios.get(URL_QUIZZ + "/" + quizID);
    promise.then(switchToQuizzPage);
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

getServerQuizzes();
