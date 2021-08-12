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

function switchToQuizzPage(quiz) {
    // Insert here the code to prepare the quiz page 2
    // Keep in mind that "quiz" have all the elements needed for the construction of the page 2
    document.querySelector(".quiz-list").classList.add("hidden");
    document.querySelector(".quiz-page").classList.remove("hidden");
}

function playQuizz(quizID) {
    const promise = axios.get(URL_QUIZZ + "/" + quizID);
    promise.then(switchToQuizzPage);
}

getServerQuizzes();