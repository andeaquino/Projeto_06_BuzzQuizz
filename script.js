const URL_QUIZZ = `https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes`;
const newQuizzScreen = document.querySelector(".new-quiz-screen");
const newQuizzInfo = {
    title: "",
    imageURL: "",
    numberOfQuestions: 0,
    numberOfLevels: 0
};

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

function switchToQuizz(quiz) {
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
            `<li class="option" onclick="selectAnswer(this)">
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
    
    switchPage("quiz-list", "quiz-page")
}

function switchPage(pageFrom, pageTo) {
    document.querySelector(`.${pageFrom}`).classList.add("hidden");
    document.querySelector(`.${pageTo}`).classList.remove("hidden");
}

function playQuizz(quizID) {
    const promise = axios.get(URL_QUIZZ + "/" + quizID);
    promise.then(switchToQuizz);
}

function animateButton(thisButton) {
    thisButton.classList.add("selected");
    setTimeout(function() {
        thisButton.classList.remove("selected");
    },80);
}

function printQuestions () {
    let questions = ``;
    let buttonClass;
    let descriptionClass;
    for (let i = 0 ; i < newQuizzInfo.numberOfQuestions ; i++) {
        if (i===0) {
            buttonClass = "hidden";
            descriptionClass = ""
        } else {
            buttonClass = "";
            descriptionClass = "hidden"
        }
        questions += `
        <li>
            <div class="option-title">
                <span>Pergunta ${i+1}</span>
                <button class = "${buttonClass}" onclick = "editQuestion(this)">
                    <img src="media/Edit-Vector.png">
                </button>
            </div>
            <div class = "option-description ${descriptionClass}">
                <input type="text" placeholder="Texto da pergunta">
                <input type="text" placeholder="Cor de fundo da pergunta">
                <span>Resposta correta</span>
                <input type="text" placeholder="Resposta correta">
                <input type="text" placeholder="URL da imagem">
                <span>Respostas incorretas</span>
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="text" placeholder="URL da imagem 1">
                <input type="text" placeholder="Resposta incorreta 2">
                <input type="text" placeholder="URL da imagem 2">   
                <input type="text" placeholder="Resposta incorreta 3">
                <input type="text" placeholder="URL da imagem 3">
            </div>
        </li>`;   
    }
        return questions;
}

function createNewQuestionsScreen() {
    const basicInfoScreen = newQuizzScreen.querySelector(".basic-info-screen");
    basicInfoScreen.classList.add("hidden");
    const newQuestionsScreen = newQuizzScreen.querySelector(".new-questions-screen");
    newQuestionsScreen.classList.remove("hidden");
    questions = printQuestions ()
    newQuestionsScreen.innerHTML = `
    <span class = "title">Crie suas perguntas</span>
    <ul class="new-questions">
        ${questions}
    </ul>
    <button class = "forward">Prosseguir para criar níveis</button>`;
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
        createNewQuestionsScreen();
    } else {
        alert("Houve um erro na validação dos itens listados! Por favor, tente novamente");
        buttonDisableSwitch(forwardButton);
    }
}

function importInputValues(thisButton) {
    animateButton(thisButton)
    buttonDisableSwitch(thisButton);
    const inputsArea = newQuizzScreen.querySelector(".new-basic-info");
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

function selectAnswer (answer) {
    const question = answer.parentNode;
    const answers = question.children;

    const isAnswered = question.querySelector(".not-selected");

    if (isAnswered === null) {
        for (let i = 0; i < answers.length; i++) {
            answers[i].classList.add("not-selected");
        }
    
        answer.classList.remove("not-selected");
    }
}

getServerQuizzes();
