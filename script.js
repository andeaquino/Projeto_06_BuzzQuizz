const URL_QUIZZ = `https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes`;
const newQuizzScreen = document.querySelector(".new-quiz-screen");
const newQuizzInfo = {
    title: "",
    image: "",
    questions: [],
    levels: []
};
const validationResults = [];
let questionsAnswered = 0;
let levels = [];
let rightAnswers = 0;

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
    levels = quiz.data.levels;
    clearQuizz();
    for (let i = 0; i < quiz.data.questions.length; i++) {
        let randomAnswers = quiz.data.questions[i].answers.sort(randomize);
        let answers = "";
        for (let j = 0; j < randomAnswers.length; j++) {
            answers += 
            `<li class="option" onclick="selectAnswer(this)">
                <img src="${randomAnswers[j].image}" alt="Option Imagem">
                <span>${randomAnswers[j].text}</span>
                <span class="value hidden">${randomAnswers[j].isCorrectAnswer}</span>
            </li>`;
        }
        questions.innerHTML += 
        `<section class="question">
            <header class="question-title" style="background-color:${quiz.data.questions[i].color}">${quiz.data.questions[i].title}</header>
            <ul class="answers">
                ${answers}
            </ul>
        </section>`;
        console.log(questions.innerHTML);
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

function selectAnswer(answer) {
    const question = answer.parentNode;
    const answers = question.children;
    const isAnswered = question.querySelector(".not-selected");
    if (isAnswered === null) {
        for (let i = 0; i < answers.length; i++) {
            answers[i].classList.add("not-selected");
            let value = answers[i].querySelector(".value").innerText;
            if (value === "true") {
                answers[i].classList.add("correct")
            } else {
                answers[i].classList.add("wrong") 
            }
        }
        if (answer.querySelector(".value").innerText === "true") {
            rightAnswers++;
        }
        answer.classList.remove("not-selected");
        setTimeout(scrollToNextQuestion, 2000, question.parentNode);
        questionsAnswered++;
        const questionsNumber = document.querySelectorAll(".question").length;
        console.log(questionsAnswered);
        console.log(questionsNumber);
        if (questionsAnswered === questionsNumber) {
            setTimeout(showResults, 2000, questionsNumber);
        }    
    }
}

function scrollToNextQuestion(question) {
    questions = document.querySelectorAll(".question");
    for (let i = 0; i < questions.length; i++) {
        if ((question === questions[i]) && (i + 1 < questions.length)) {
            questions[i + 1].scrollIntoView();
        }
    }
}

function showResults(questionsNumber) { 
        const score = Math.round((rightAnswers / questionsNumber) * 100);
        let level = 0;
        for (let i = 0; i < levels.length; i++) {
            if (score >= levels[i].minValue) {
                level = i;
            }
        }
        const result = document.querySelector(".result");
        result.innerHTML = `
                <header class="score">${score}% de acerto: ${levels[level].title}</header>
                <div class="description">
                    <img src="${levels[level].image}" alt="Result Image">
                    <p>${levels[level].text}</p>
                </div>`;
        result.classList.remove("hidden");
        result.scrollIntoView();
}

function clearQuizz() {
    questionsAnswered = 0;
    rightAnswers = 0;
    clearClass("not-selected");
    clearClass("correct");
    clearClass("wrong");
    const result = document.querySelector(".result");
    result.classList.add("hidden");
    window.scrollTo(0, 0);
}

function clearClass(className) {
    const group = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < group.length; i++) {
        group[i].classList.remove(`${className}`);
    }
}

function animateButton(thisButton) {
    thisButton.classList.add("selected");
    setTimeout(function() {
        thisButton.classList.remove("selected");
    },80);
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

function editOption (thisButton) {
    const thisOption = thisButton.parentNode.parentNode;
    const thisUl = thisOption.parentNode;
    const selectedOption = thisUl.querySelector(".selected");
    selectedOption.classList.remove("selected");
    thisOption.classList.add("selected")
}

function printQuestions () {
    let questions = ``;
    let questionClass;
    for (let i = 0 ; i < newQuizzInfo.questions.length ; i++) {
        if (i===0) {
            questionClass = "selected";
        } else {
            questionClass = "";
        }
        questions += `
        <li class = "${questionClass}">
            <div class="option-title">
                <span>Pergunta ${i+1}</span>
                <button onclick = "editOption(this)">
                    <img src="media/Edit-Vector.png">
                </button>
            </div>
            <div class = "option-description">
                <div>
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="color" placeholder="Cor de fundo da pergunta" value="#FFFFFF">
                    <span onclick='return false'>Cor de fundo da pergunta</span>
                </div>
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

    //<input type="color" placeholder="Cor de fundo da pergunta" value="#FFFFFF">
    return questions;
}

function createNewQuestionsScreen() {
    const basicInfoScreen = newQuizzScreen.querySelector(".basic-info-screen");
    basicInfoScreen.classList.add("hidden");
    const newQuestionsScreen = newQuizzScreen.querySelector(".new-questions-screen");
    newQuestionsScreen.classList.remove("hidden");
    const newQuestionsArea = newQuizzScreen.querySelector(".new-questions-screen .new-questions");
    questions = printQuestions ()
    newQuestionsArea.innerHTML = questions
}

function validateImageURL(inputs,arrayIndex,screenForwardButton) {
    const UrlCheck = new Image();
    const imageUrl = inputs[arrayIndex].value
    UrlCheck.src = imageUrl;
    UrlCheck.addEventListener('load',  function() {
        validationResults[arrayIndex] = true;
        if (areAllInputsImported(inputs)) {
            validateAllInputs(screenForwardButton);
        }
    });
    UrlCheck.addEventListener('error', function() {
        validationResults[arrayIndex] = false;
        if (areAllInputsImported(inputs)) {
            validateAllInputs(screenForwardButton);
        }
    });
}

function validateSingleInput(input) {
    const inputValue = input.value;
    const validation = [
        {id: "quizz-title", condition: (inputValue.length >= 20 && inputValue.length <= 65)},
        {id: "number-of-questions", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 3)},
        {id: "number-of-levels", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 2)},

    ]

    const condition = validation.find( ({ id }) => id === input.id ).condition;
    return condition;
}

function validateAllInputs(screenForwardButton) {
    if (validationResults.includes(false)){
        buttonDisableSwitch(screenForwardButton);
        alert("Houve um erro na validação das entradas! Por favor tente novamente")
    } else {
        createNewQuestionsScreen()
    }
}

function areAllInputsImported(inputs) {
    return (!validationResults.includes(undefined) && validationResults.length === inputs.length)
}

function checkInputsValidation(inputs,screenForwardButton) {
    validationResults.length = 0;
    for (let i = 0 ; i < inputs.length ; i++) {
        if (inputs[i].id === "image-url") {
            validateImageURL(inputs,i,screenForwardButton);
        } else {
            validationResults[i] = validateSingleInput(inputs[i]);
        }
    }
    if (areAllInputsImported(inputs)) {
        validateAllInputs(screenForwardButton);
    } 
}

function importNewQuizzInfoValues(thisButton) {
    animateButton(thisButton)
    buttonDisableSwitch(thisButton);
    const inputsArea = thisButton.parentNode;
    const inputs = inputsArea.querySelectorAll("input");
    newQuizzInfo.title = inputs[0].value;
    newQuizzInfo.image = inputs[1].value;
    for (let i = 0 ; i < Number(inputs[2].value) ; i++) {
        newQuizzInfo.questions.push({title:"", color:"", answers:[] })
    }
    for (let i = 0 ; i < Number(inputs[3].value) ; i++) {
        newQuizzInfo.levels.push({title:"", image:"", text:"", minValue:0 })
    }
    checkInputsValidation(inputs,thisButton);
}

function importNewQuizzQuestionsValues(thisButton) {
    animateButton(thisButton)
    buttonDisableSwitch(thisButton);
    const inputsArea = thisButton.parentNode;
    const inputs = inputsArea.querySelectorAll("input");

    checkInputsValidation(inputs,thisButton);
}

getServerQuizzes();
