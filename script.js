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
const validationResults = [];
let questionsAnswered = 0;
let levels = [];
let rightAnswers = 0;

function startLoading() {
    const loadingScreen = document.querySelector(".loading-screen");
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
    const loadingScreen = document.querySelector(".loading-screen");
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
    document.querySelector(".list-of-all-quizzes ul").innerHTML = text;
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

function buttonDisableSwitch(thisButton) {
    if (thisButton.disabled === false){
        thisButton.disabled = true;
        thisButton.innerHTML = `<img src="media/Button Loading.gif">`
    } else {
        thisButton.disabled = false;
        if (thisButton.classList.contains("basic-info")) {
            thisButton.innerHTML = "Prosseguir pra criar perguntas"
        } else if (thisButton.classList.contains("new-questions")) {
            thisButton.innerHTML = "Prosseguir para criar níveis"
        } else if (thisButton.classList.contains("new-levels")) {
            thisButton.innerHTML = "Finalizar Quizz"
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
    <div class ="basic-info-screen">
        <span class = "title">Comece pelo começo</span>
        <div class = "new-basic-info">
            <input type="text" placeholder="Título do seu quizz" name="quizz-title">
            <input type="text" placeholder="URL da imagem do seu quizz" name="image-url">
            <input type="number" placeholder="Quantidade de perguntas do quizz" name="number-of-questions">
            <input type="number" placeholder="Quantidade de níveis do quizz" name="number-of-levels">
        </div>
        <button class = "basic-info forward" onclick="importInputValues(this)">Prosseguir pra criar perguntas</button>
    </div>`;
}

function createNewQuestionsScreen() {
    newQuizzScreen.innerHTML = `
    <div class="new-questions-screen">
        <span class = "title">Crie suas perguntas</span>
        <ul class="new-questions">
            ${printQuestions()}
        </ul>
        <button class = "new-questions forward" onclick="importInputValues(this)">Prosseguir para criar níveis</button>
    </div>`;
}

function createNewLevelsScreen() {
    newQuizzScreen.innerHTML = `
    <div class="new-levels-screen">
        <span class = "title">Agora, decida os níveis!</span>
        <ul class="new-levels">
            ${printLevels()}
        </ul>
        <button class = "new-levels forward" onclick="importInputValues(this)">Finalizar Quizz</button>
    </div>`;
}

function createSuccessfullyCreatedScreen(answer) {
    newQuizzInfo.quizzID = answer.data.id;
    stopLoading();
    newQuizzScreen.innerHTML = `
    <div class="quizz-successfully-created">
        <span class = "title">Seu quizz está pronto!</span>
        <div class="new-quizz-layout">
            <div class="grad"></div>
            <img src="${newQuizzInfo.object.image}">
            <span>${newQuizzInfo.object.title}</span>
        </div>
        <button class = "forward" onclick="playQuizz(newQuizzInfo.quizzID)">Acessar Quizz</button>
        <button class="return-homescreen" onclick="switchPage('quizz-list')">Voltar para home</button>
    </div>`
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
        {name: "question-background-color", condition: true},
        {name: "question-answer", condition: (inputValue.value !== "")},
        {name: "level-title", condition: (inputValue.length >= 10)},
        {name: "minimum-percentage", condition: (!isNaN(Number(inputValue)) && Number(inputValue) >= 0 && Number(inputValue) <= 100)},
        {name: "level-description", condition: (inputValue.length >= 30)},
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
        saveImportedNewQuestionsValues(screenForwardButton);
        createNewLevelsScreen();
    }
    if (screenForwardButton.classList.contains("new-levels")) {
        saveImportedNewLevelsValues(screenForwardButton);
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
    const levelsMinimumPercentagesInputs = inputs.filter(( ({ name }) => name === "minimum-percentage" ));
    const levelsMinimumPercentagesValues = levelsMinimumPercentagesInputs.map((elemento) => Number(elemento.value));
    if (levelsMinimumPercentagesValues.length !== 0 ) {
        if (!levelsMinimumPercentagesValues.includes(0)) {
            buttonDisableSwitch(screenForwardButton);
            alert("Houve um erro na validação das entradas! Por favor tente novamente")
            return
        }
    }
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
    newQuizzInfo.object.title = inputs[0].value;
    newQuizzInfo.object.image = inputs[1].value;
    newQuizzInfo.numberOfQuestions = Number( inputs[2].value);
    newQuizzInfo.numberOfLevels = Number( inputs[3].value);
}

function saveImportedNewQuestionsValues(screenForwardButton) {
    const inputsArea = screenForwardButton.parentNode;
    for (let i = 0 ; i < newQuizzInfo.numberOfQuestions ; i++) {
        const thisQuestion = inputsArea.querySelector(`li:nth-of-type(${i+1})`) ;
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

function saveImportedNewLevelsValues(screenForwardButton) {
    const inputsArea = screenForwardButton.parentNode;
    for (let i = 0 ; i < newQuizzInfo.numberOfLevels ; i++) {
        const thisLevel = inputsArea.querySelector(`li:nth-of-type(${i+1})`) ;
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
    buttonDisableSwitch(thisButton);
    const inputsArea = thisButton.parentNode;
    let inputs = Array.from(inputsArea.querySelectorAll("input, textarea"));
    checkInputsValidation(inputs,thisButton);
}

getServerQuizzes();