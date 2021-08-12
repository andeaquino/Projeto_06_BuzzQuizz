const URL_QUIZZ = `https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes`;

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


getServerQuizzes();