const URL_QUIZZ = `https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes`;
const newQuizzScreen = document.querySelector(".new-quizz-screen");
const playQuizzScreen = document.querySelector(".quizz-page");
const homeScreen = document.querySelector(".quizz-list");
const loadingScreen = document.querySelector(".loading-screen");
const newQuizzInfo = {
    quizzID:'',
    numberOfLevels:0,
    numberOfQuestions:0,
    object:{
        title: "",
        image: "",
        questions: [],
        levels: []
    }
};
const inputsValidation = {
    activeInputs: [],
    totalAttempts:0,
    attemptsCounter: 0,
    results: [],
    validInputs: [],
}

let questionsAnswered = 0;
let levels = [];
let rightAnswers = 0;

function startLoading() {
    loadingScreen.classList.remove("hidden");
    setTimeout(() => {
        if (loadingScreen.classList.contains("already-loaded")) {
            loadingScreen.classList.add("hidden"); 
            loadingScreen.classList.remove("already-loaded");   
        } else {
            loadingScreen.classList.add("still-loading");
        }
    }, 1500);
}

function stopLoading() {
    loadingScreen.classList.add("already-loaded");
    if (loadingScreen.classList.contains("still-loading")) {
        loadingScreen.classList.remove("hidden");
        loadingScreen.classList.remove("still-loading");
    }
}

function thumbStructure(element) {
    return `<li class="quizz-thumb" onclick="playQuizz(${element.id})">
                <div class="thumb grad"></div>
                <img src="${element.image}" alt="Test Image">
                <h2 class="quizz-thumb-title">${element.title}</h2>
            </li>`;
}

function updateQuizzes(promise) { 
    stopLoading();
    let text = "";
    for(i = 0; i < promise.data.length; i++) {
        text += thumbStructure(promise.data[i]);
    }
    homeScreen.querySelector(".list-of-all-quizzes ul").innerHTML = text;
}

function getServerQuizzes() {
    const promise = axios.get(URL_QUIZZ);
    promise.then(updateQuizzes);
    startLoading();
}

function randomize() { 
	return Math.random() - 0.5; 
}

function clearClass(className) {
    const group = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < group.length; i++) {
        group[i].classList.remove(`${className}`);
    }
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

function printQuizz(quizz) {
    stopLoading();
    const title = document.querySelector(".quizz-title");
    title.innerText = quizz.data.title;
    const banner = document.querySelector(".banner-image");
    banner.src = quizz.data.image;
    const questions = document.querySelector(".quizz-questions");
    questions.innerHTML = "";
    levels = quizz.data.levels;
    for (let i = 0; i < quizz.data.questions.length; i++) {
        let randomAnswers = quizz.data.questions[i].answers.sort(randomize);
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
        `<div class="question">
            <header class="question-title" style="background-color:${quizz.data.questions[i].color}">${quizz.data.questions[i].title}</header>
            <ul class="answers">
                ${answers}
            </ul>
        </div>`;
    } 
    clearQuizz();
    switchPage("quizz-page")
}

function switchPage(pageTo) {
    newQuizzScreen.classList.add("hidden");
    playQuizzScreen.classList.add("hidden");
    homeScreen.classList.add("hidden");
    if (pageTo === "quizz-list") {
        getServerQuizzes()
    }
    document.querySelector(`.${pageTo}`).classList.remove("hidden");
}

function playQuizz(quizzID) {
    const promise = axios.get(URL_QUIZZ + "/" + quizzID);
    promise.then(printQuizz);
    startLoading();
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

function scrollToNextQuestion(question) {
    questions = document.querySelectorAll(".question");
    for (let i = 0; i < questions.length; i++) {
        if ((question === questions[i]) && (i + 1 < questions.length)) {
            questions[i + 1].scrollIntoView();
        }
    }
}

function selectAnswer(answer) {
    const question = answer.parentNode;
    const isAnswered = question.querySelector(".not-selected");
    if (isAnswered === null) {
        const answers = question.children;
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
        if (questionsAnswered === questionsNumber) {
            setTimeout(showResults, 2000, questionsNumber);
        }    
    }
}

function animateButton(thisButton) {
    thisButton.classList.add("selected");
    setTimeout(() => thisButton.classList.remove("selected"),80);
}

function buttonDisableSwitch() {
    const forwardButton = newQuizzScreen.querySelector("button.forward")
    if (forwardButton.disabled === false){
        forwardButton.disabled = true;
        forwardButton.innerHTML = `<img src="media/Button Loading.gif">`
    } else {
        forwardButton.disabled = false;
        if (forwardButton.classList.contains("basic-info")) {
            forwardButton.innerHTML = "Prosseguir pra criar perguntas"
        } else if (forwardButton.classList.contains("new-questions")) {
            forwardButton.innerHTML = "Prosseguir para criar níveis"
        } else if (forwardButton.classList.contains("new-levels")) {
            forwardButton.innerHTML = "Finalizar Quizz"
        }
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
    for (let i = 0 ; i < newQuizzInfo.numberOfQuestions ; i++) {
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

function printLevels () {
    let levels = ``;
    let levelsClass;
    for (let i = 0 ; i < newQuizzInfo.numberOfLevels ; i++) {
        if (i===0) {
            levelsClass = "selected";
        } else {
            levelsClass = "";
        }
        levels += `
            <li class = "${levelsClass}">
            <div class="option-title">
                <span>Nível ${i+1}</span>
                <button onclick = "editOption(this)">
                    <img src="media/Edit-Vector.png">
                </button>
            </div>
            <div class = "option-description">
                <input type="text" placeholder="Título do nível" name="level-title">
                <input type="number" placeholder="% de acerto" name="minimum-percentage">
                <input type="text" placeholder="URL da imagem do nível" name="level-title">
                <textarea id="story" placeholder="Descrição do nível" name="level-description" rows="5" cols="33"></textarea>
            </div>
        </li>`;   
    }
    return levels;
}

function createBasicInfoScreen() {
    const homeScreen = document.querySelector(".quizz-list");
    homeScreen.classList.add("hidden");
    newQuizzScreen.classList.remove("hidden");
    newQuizzScreen.innerHTML = `
    <span class = "title">Comece pelo começo</span>
    <div class = "new-basic-info">
        <input type="text" placeholder="Título do seu quizz" name="quizz-title">
        <input type="text" placeholder="URL da imagem do seu quizz" name="image-url">
        <input type="number" placeholder="Quantidade de perguntas do quizz" name="number-of-questions">
        <input type="number" placeholder="Quantidade de níveis do quizz" name="number-of-levels">
    </div>
    <button class = "basic-info forward" onclick="importInputValues(this)">Prosseguir pra criar perguntas</button>`;
}

function createNewQuestionsScreen() {
    newQuizzScreen.innerHTML = `
    <span class = "title">Crie suas perguntas</span>
    <ul class="new-questions">
        ${printQuestions()}
    </ul>
    <button class = "new-questions forward" onclick="importInputValues(this)">Prosseguir para criar níveis</button>`;
}

function createNewLevelsScreen() {
    newQuizzScreen.innerHTML = `
        <span class = "title">Agora, decida os níveis!</span>
        <ul class="new-levels">
            ${printLevels()}
        </ul>
        <button class = "new-levels forward" onclick="importInputValues(this)">Finalizar Quizz</button>`;
}

function createSuccessfullyCreatedScreen(answer) {
    newQuizzInfo.quizzID = answer.data.id;
    stopLoading();
    newQuizzScreen.innerHTML = `
        <span class = "title">Seu quizz está pronto!</span>
        <div class="new-quizz-layout">
            <div class="grad"></div>
            <img src="${newQuizzInfo.object.image}">
            <span>${newQuizzInfo.object.title}</span>
        </div>
        <button class = "forward" onclick="playQuizz(newQuizzInfo.quizzID)">Acessar Quizz</button>
        <button class="return-homescreen" onclick="switchPage('quizz-list')">Voltar para home</button>`;
}

function moveToNextScreen() {
    if (newQuizzScreen.querySelector(".basic-info")) {
        saveImportedBasicInfoValues();
        createNewQuestionsScreen();
    } else if (newQuizzScreen.querySelector(".new-questions")) {
        saveImportedNewQuestionsValues();
        createNewLevelsScreen();
    }else if (newQuizzScreen.querySelector(".new-levels")) {
        saveImportedNewLevelsValues();
        quizzPromise = axios.post(URL_QUIZZ,newQuizzInfo.object);
        quizzPromise.then(createSuccessfullyCreatedScreen);
        quizzPromise.catch(uploadError);
        startLoading();
    }
}

function uploadError() {
    stopLoading();
    alert("Oh não! Parece que houve um erro :/ Nós sentimos muito! Por favor, tente novamente...");
    createBasicInfoScreen()
}

function checkValidationAllInputs() {
    if (inputsValidation.totalAttempts === inputsValidation.attemptsCounter) {
        if (inputsValidation.activeInputs.length === inputsValidation.validInputs.length) {
            moveToNextScreen();
        } else {
            buttonDisableSwitch();
            alert("Houve um erro na validação das entradas! Por favor tente novamente")
        }
    }
}

function validateSingleInput(element,index,array) {
    const inputValue = element.value;
    const inputsValidationConditions = [
        {name: "quizz-title", condition: (inputValue.length >= 20 && inputValue.length <= 65)},
        {name: "number-of-questions", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 3)},
        {name: "number-of-levels", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 2)},
        {name: "question-title", condition: (inputValue.length >= 20)},
        {name: "question-background-color", condition: true},
        {name: "question-answer", condition: (inputValue.value !== "")},
        {name: "level-title", condition: (inputValue.length >= 10)},
        {name: "level-description", condition: (inputValue.length >= 30)},
    ]
    const condition = inputsValidationConditions.find( ({ name }) => name === element.name ).condition;
    return condition;
}

function validateImageURL(element) {
    const UrlCheck = new Image();
    const imageUrl = element.value;
    UrlCheck.addEventListener('load',  function() {
        inputsValidation.attemptsCounter += 1;
        inputsValidation.validInputs.push(element);
        checkValidationAllInputs();
    });
    UrlCheck.addEventListener('error', function() {
        inputsValidation.attemptsCounter += 1;
        checkValidationAllInputs();
    });
    UrlCheck.src = imageUrl;
}

function isValidEmptyAnswer(element,i,array) {
    const isValidEmptyText = ((i % 10 >=6) && element.value === "" && (i !== array.length-1) && array[i+1].name === "image-url" && array[i+1].value === ""); 
    const isValidEmptyUrl = ((i % 10 >=6) && element.value === "" && (i !== 0) && array[i-1].name === "question-answer" && array[i-1].value === ""); ;
    return (isValidEmptyText || isValidEmptyUrl)
}

function isMinimumValuesValid(element,index,array) {
    const inputValues = array.map((input) => Number(input.value));
    const duplicatedValues = inputValues.filter((value, i) => inputValues.indexOf(value) !== i);
    const isDuplicated = duplicatedValues.includes(Number(element.value))
    const isSingleValid =  (!isNaN(Number(element.value)) && Number(element.value) >= 0 && Number(element.value) <= 100);
    return inputValues.includes(0) && !isDuplicated && isSingleValid;
}

function stageValidation(array, validationFunction) {
    const validActiveInputs = array.filter((element,index,array) => validationFunction(element,index,array));
    inputsValidation.validInputs.push(...validActiveInputs)
    inputsValidation.attemptsCounter += 1;
}

function checkInputsValidation() {
    inputsValidation.results.length = 0;
    inputsValidation.attemptsCounter = 0;
    inputsValidation.validInputs = [];
    const minPercentagesInputs = inputsValidation.activeInputs.filter( ({ name,value }) => name === "minimum-percentage" && value !== "");
    const nonEmptyImageUrlInputs = inputsValidation.activeInputs.filter( ({ name, value }) => name === "image-url" && value !== "");
    const everyOtherInput = inputsValidation.activeInputs.filter(element => !minPercentagesInputs.includes(element) && !nonEmptyImageUrlInputs.includes(element) && element.value !== "");
    inputsValidation.totalAttempts = 3 + nonEmptyImageUrlInputs.length;

    stageValidation(inputsValidation.activeInputs, isValidEmptyAnswer);
    stageValidation(minPercentagesInputs, isMinimumValuesValid);
    stageValidation(everyOtherInput, validateSingleInput);

    nonEmptyImageUrlInputs.forEach(element => validateImageURL(element))

    checkValidationAllInputs();
}

function saveImportedBasicInfoValues() {
    inputsValidation.activeInputs = Array.from(newQuizzScreen.querySelectorAll("input"));
    newQuizzInfo.object.title = inputsValidation.activeInputs[0].value;
    newQuizzInfo.object.image = inputsValidation.activeInputs[1].value;
    newQuizzInfo.numberOfQuestions = Number( inputsValidation.activeInputs[2].value);
    newQuizzInfo.numberOfLevels = Number( inputsValidation.activeInputs[3].value);
}

function saveImportedNewQuestionsValues() {
    for (let i = 0 ; i < newQuizzInfo.numberOfQuestions ; i++) {
        const thisQuestion = newQuizzScreen.querySelector(`li:nth-of-type(${i+1})`) ;
        const questionInputs = Array.from(thisQuestion.querySelectorAll("input"));
        newQuizzInfo.object.questions[i] = {
            title: questionInputs[0].value,
            color:questionInputs[1].value,
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
                newQuizzInfo.object.questions[i].answers.push(answerObject);
            }
        }
    }
}

function saveImportedNewLevelsValues() {
    for (let i = 0 ; i < newQuizzInfo.numberOfLevels ; i++) {
        const thisLevel = newQuizzScreen.querySelector(`li:nth-of-type(${i+1})`) ;
        const levelInputs = Array.from(thisLevel.querySelectorAll("input, textarea"));
        newQuizzInfo.object.levels[i] = {
            title: levelInputs[0].value,
            minValue: Number(levelInputs[1].value),
			image: levelInputs[2].value,
			text: levelInputs[3].value
        };
    }
}

function importInputValues(thisButton) {
    animateButton(thisButton);
    buttonDisableSwitch();
    inputsValidation.activeInputs = Array.from(newQuizzScreen.querySelectorAll("input, textarea"));
    checkInputsValidation(thisButton);
}

getServerQuizzes();