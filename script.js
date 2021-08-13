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
    rightAnswers = 0;
    questionsAnswered = 0;

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

function selectAnswer (answer) {
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
        setTimeout(showResults, 2000); 
    }
}

function scrollToNextQuestion (question) {
    questions = document.querySelectorAll(".question");

    for (let i = 0; i < questions.length; i++) {
        if ((question === questions[i]) && (i + 1 < questions.length)) {
            questions[i + 1].scrollIntoView();
        }
    }
}

function showResults () {
    const questionsNumber = document.querySelectorAll(".question").length;

    if (questionsAnswered === questionsNumber) {   
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
}

function restartQuizz () {
    questionsAnswered = 0;
    rightAnswers = 0;

    clearClass("not-selected");
    clearClass("correct");
    clearClass("wrong");

    const result = document.querySelector(".result");
    result.classList.add("hidden");
    window.scrollTo(0, 0);
}

function clearClass (className) {
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
                    <input type="text" placeholder="Texto da pergunta" name="question-title">
                    <input type="color" placeholder="Cor de fundo da pergunta" value="#FFFFFF" name="question-background-color">
                    <span>Cor de fundo da pergunta</span>
                </div>
                <span>Resposta correta</span>
                <input type="text" placeholder="Resposta correta" name="question-answer">
                <input type="text" placeholder="URL da imagem" name="image-url">
                <span>Respostas incorretas</span>
                <input type="text" placeholder="Resposta incorreta 1" name="question-answer">
                <input type="text" placeholder="URL da imagem 1" name="image-url">
                <input type="text" placeholder="Resposta incorreta 2" name="question-answer">
                <input type="text" placeholder="URL da imagem 2" name="image-url">   
                <input type="text" placeholder="Resposta incorreta 3" name="question-answer">
                <input type="text" placeholder="URL da imagem 3" name="image-url">
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
    const newQuestionsArea = newQuizzScreen.querySelector(".new-questions-screen .new-questions");
    questions = printQuestions ()
    newQuestionsArea.innerHTML = questions
}

function validateImageURL(inputs,i,screenForwardButton) {
    const UrlCheck = new Image();
    const imageUrl = inputs[i].value
    UrlCheck.src = imageUrl;
    UrlCheck.addEventListener('load',  function() {
        validationResults[i] = true;
        if (areAllInputsImported(inputs)) {
            validateAllInputs(screenForwardButton);
        }
    });
    UrlCheck.addEventListener('error', function() {
        validationResults[i] = false;
        if (areAllInputsImported(inputs)) {
            validateAllInputs(screenForwardButton);
        }
    });
}

function validateSingleInput(inputs,i) {
    const inputValue = inputs[i].value;
    const validation = [
        {name: "quizz-title", condition: (inputValue.length >= 20 && inputValue.length <= 65)},
        {name: "number-of-questions", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 3)},
        {name: "number-of-levels", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 2)},
        {name: "question-title", condition: (inputValue.length >= 20)},
        {name: "question-background-color", condition: true },
        {name: "question-answer", condition: (inputValue.value !== "")},
    ]
    const condition = validation.find( ({ name }) => name === inputs[i].name ).condition;
    return condition;
}

function moveToNextScreen(screenForwardButton) {
    if (screenForwardButton.classList.contains("basic-info")) {
        saveImportedBasicInfoValues(screenForwardButton);
        createNewQuestionsScreen();
    }
    if (screenForwardButton.classList.contains("new-questions")) {
        alert("Opa!");
        saveImportedNewQuestionsValues(screenForwardButton)
        buttonDisableSwitch(screenForwardButton);
    }
}

function validateAllInputs(screenForwardButton) {
    if (validationResults.includes(false)){
        buttonDisableSwitch(screenForwardButton);
        alert("Houve um erro na validação das entradas! Por favor tente novamente")
    } else {
        moveToNextScreen(screenForwardButton);
    }
}

function areAllInputsImported(inputs) {
    return (!validationResults.includes(undefined) && validationResults.length === inputs.length)
}

function isValidEmptyAnswer (inputs,i) {
    const isEmptyText = ((i % 10 >=6) && inputs[i].value === "" && (i !== inputs.length-1) && inputs[i+1].name === "image-url" && inputs[i+1].value === ""); 
    const isEmptyUrl = ((i % 10 >=6) && inputs[i].value === "" && (i !== 0) && inputs[i-1].name === "question-answer" && inputs[i-1].value === ""); ;
    return (isEmptyText || isEmptyUrl)
}

function checkInputsValidation(inputs,screenForwardButton) {
    validationResults.length = 0;
    for (let i = 0 ; i < inputs.length ; i++) {
        if (inputs[i].value === "") {
            validationResults[i] = isValidEmptyAnswer(inputs,i)
        } else if (inputs[i].name === "image-url") {
            validateImageURL(inputs,i,screenForwardButton);
        } else {
            validationResults[i] = validateSingleInput(inputs,i);
        }
    }
    if (areAllInputsImported(inputs)) {
        validateAllInputs(screenForwardButton);
    } 
}

function saveImportedBasicInfoValues(screenForwardButton) {
    const inputsArea = screenForwardButton.parentNode;
    let inputs = Array.from(inputsArea.querySelectorAll("input"));
    newQuizzInfo.title = inputs[0].value;
    newQuizzInfo.image = inputs[1].value;
    for (let i = 0 ; i < Number(inputs[2].value) ; i++) {
        newQuizzInfo.questions.push({title:"", color:"", answers:[] });
    }
    for (let i = 0 ; i < Number(inputs[3].value) ; i++) {
        newQuizzInfo.levels.push({title:"", image:"", text:"", minValue:0 });
    }
}

function saveImportedNewQuestionsValues(screenForwardButton) {
    const inputsArea = screenForwardButton.parentNode;
    let inputs = Array.from(inputsArea.querySelectorAll("input"));
    for (let i = 0 ; i < newQuizzInfo.questions.length ; i++) {
        const thisQuestion = inputsArea.querySelector(`li:nth-of-type(${i+1})`) ;
        const questionInputs = Array.from(thisQuestion.querySelectorAll("input"));
        questionObject = {
            title: questionInputs[0].value,
            image:questionInputs[1].value,
            answers:[]
        };
        for (let j = 0 ; j < 4 ; j++) {
            const text = questionInputs[(j*2)+2].value;
            const image = questionInputs[(j*2)+3].value;
            if (j < 2 || text !== "" || image !== "") {
                answerObject = {
                    text,
                    image,
                    isCorrectAnswer: false
                }
                if (j === 0) {
                    answerObject.isCorrectAnswer = true;
                }
                questionObject.answers.push(answerObject);
            }
        }
        newQuizzInfo.questions[i] = questionObject;
    }
}

function importInputValues(thisButton) {
    animateButton(thisButton);
    buttonDisableSwitch(thisButton);
    const inputsArea = thisButton.parentNode;
    let inputs = Array.from(inputsArea.querySelectorAll("input"));
    checkInputsValidation(inputs,thisButton);
}

getServerQuizzes();