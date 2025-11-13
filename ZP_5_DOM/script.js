var questions = [
    {
        text: 'А когда с человеком может произойти дрожемент?',
        answers: [
            { text: 'Когда он влюбляется', correct: false },
            { text: 'Когда он идет шопиться', correct: false },
            { text: 'Когда он слышит смешную шутку', correct: false },
            { text: 'Когда он боится, пугается', correct: true }
        ],
        explanation: 'Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».'
    },
    {
        text: 'Говорят, Антон заовнил всех. Это еще как понимать?',
        answers: [
            { text: 'Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?', correct: false },
            { text: 'Антон очень надоедливый и въедливый человек, всех задолбал', correct: false },
            { text: 'Молодец, Антон, всех победил!', correct: false },
            { text: 'Антон победил всех, завладел ситуацией', correct: true }
        ],
        explanation: 'Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить».'
    },
    {
        text: 'А фразу «заскамить мамонта» как понимать?',
        answers: [
            { text: 'Разозлить кого-то из родителей', correct: false },
            { text: 'Увлекаться археологией', correct: false },
            { text: 'Развести недотепу на деньги', correct: true },
            { text: 'Оскорбить пожилого человека', correct: false }
        ],
        explanation: 'Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца.'
    },
    {
        text: 'Кто такие бефефе?',
        answers: [
            { text: 'Вши?', correct: false },
            { text: 'Милые котики, такие милые, что бефефе', correct: false },
            { text: 'Лучшие друзья', correct: true },
            { text: 'Люди, которые не держат слово', correct: false }
        ],
        explanation: 'Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.'
    }
];

var shuffledQuestions = [];
var currentQuestionIndex = -1;
var answeredQuestions = [];
var correctAnswers = 0;
var isAnswered = false;
var allQuestionsAnswered = false;
var userAnswers = []; // Массив для хранения ответов пользователя (индекс ответа для каждого вопроса)

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

function initializeQuiz() {
    // Перемешиваем вопросы
    shuffledQuestions = shuffleArray(questions.slice());

    renderQuestions();
}

function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function renderQuestions() {
    var questionsArea = document.getElementById('questionsArea');
    questionsArea.innerHTML = '';

    for (var i = 0; i < shuffledQuestions.length; i++) {
        var questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.id = 'question-' + i;
        questionBlock.setAttribute('data-index', i);

        var questionNum = document.createElement('div');
        questionNum.className = 'question-number';
        questionNum.textContent = 'Вопрос ' + (i + 1);
        questionBlock.appendChild(questionNum);

        var questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = shuffledQuestions[i].text;
        questionBlock.appendChild(questionText);

        questionBlock.addEventListener('click', function(e) {
            if(currentQuestionIndex != e.currentTarget.getAttribute('data-index')) selectQuestion(e);
        });

        questionsArea.appendChild(questionBlock);
    }
}

function selectQuestion(event) {
    var block = event.currentTarget;

    // Если тест завершён, показываем ответы для выбранного вопроса
    if (allQuestionsAnswered) {
        var index = parseInt(block.getAttribute('data-index'));
        currentQuestionIndex = index;
        showFinalAnswerForQuestion(block);
        return;
    }

    if (!allQuestionsAnswered && block.classList.contains('answered')) {
        return;
    }

    if (!isAnswered) {
        var index = parseInt(block.getAttribute('data-index'));
        currentQuestionIndex = index;

        // Снимаем класс selected с других вопросов
        var allQuestions = document.querySelectorAll('.question-block');
        for (var i = 0; i < allQuestions.length; i++) {
            allQuestions[i].classList.remove('selected');
        }

        block.classList.add('selected');

        renderAnswers();
    }
}

function renderAnswers() {
    var answersContainer = document.getElementById('answersContainer');
    var statusMessage = document.getElementById('statusMessage');

    answersContainer.innerHTML = '';
    statusMessage.textContent = '';
    isAnswered = false;

    var currentQuestion = shuffledQuestions[currentQuestionIndex];

    // Перемешиваем ответы
    var shuffledAnswers = shuffleArray(currentQuestion.answers.slice());

    for (var i = 0; i < shuffledAnswers.length; i++) {
        var answerBlock = document.createElement('div');
        answerBlock.className = 'answer-block';
        answerBlock.setAttribute('data-correct', shuffledAnswers[i].correct);

        var answerText = document.createElement('div');
        answerText.className = 'answer-text';
        answerText.textContent = shuffledAnswers[i].text;

        answerBlock.appendChild(answerText);

        answerBlock.addEventListener('click', function(e) {
            selectAnswer(e);
        });

        answersContainer.appendChild(answerBlock);
    }
}

// Выбор ответа
function selectAnswer(event) {
    if (isAnswered) return;

    isAnswered = true;

    var answerBlock = event.currentTarget;
    var isCorrect = answerBlock.getAttribute('data-correct') === 'true';

    // Сохраняем выбранный ответ пользователя
    var allAnswers = document.querySelectorAll('.answer-block');
    var selectedAnswerIndex = -1;
    for (var i = 0; i < allAnswers.length; i++) {
        if (allAnswers[i] === answerBlock) {
            selectedAnswerIndex = i;
            break;
        }
    }
    userAnswers[currentQuestionIndex] = {
        selectedIndex: selectedAnswerIndex,
        isCorrect: isCorrect
    };

    // Отключаем все ответы
    for (var i = 0; i < allAnswers.length; i++) {
        allAnswers[i].style.pointerEvents = 'none';
    }

    if (isCorrect) {
        handleCorrectAnswer(answerBlock, allAnswers);
    } else {
        handleIncorrectAnswer(answerBlock, allAnswers);
    }
}

// Обработка правильного ответа
function handleCorrectAnswer(answerBlock, allAnswers) {
    correctAnswers++;

    // Добавляем класс correct к выбранному ответу
    answerBlock.classList.add('correct');

    // Добавляем маркер
    var marker = document.createElement('div');
    marker.className = 'marker correct';
    answerBlock.appendChild(marker);

    // Добавляем пояснение
    var explanation = document.createElement('div');
    explanation.className = 'explanation show';
    explanation.textContent = shuffledQuestions[currentQuestionIndex].explanation;
    answerBlock.appendChild(explanation);

    // Добавляем маркер в вопрос
    addMarkerToQuestion(true);

    // После задержки двигаем неправильные ответы
    setTimeout(function() {
        // Двигаем все ответы (кроме правильного) вправо
        for (var i = 0; i < allAnswers.length; i++) {
            if (allAnswers[i] !== answerBlock) {
                allAnswers[i].classList.add('slide-right');
            }
        }

        // После анимации скрываем правильный ответ
        setTimeout(function() {
            answerBlock.style.opacity = '0';
            answerBlock.style.pointerEvents = 'none';

            // Очищаем ответы
            setTimeout(function() {
                moveToNextQuestion();
            }, 500);
        }, 800);
    }, 2000);
}

// Обработка неправильного ответа
function handleIncorrectAnswer(answerBlock, allAnswers) {
    // Добавляем класс incorrect к выбранному ответу
    answerBlock.classList.add('incorrect');

    // Добавляем маркер
    var marker = document.createElement('div');
    marker.className = 'marker incorrect';
    answerBlock.appendChild(marker);

    // Добавляем маркер в вопрос
    addMarkerToQuestion(false);

    // После задержки двигаем все ответы вправо
    setTimeout(function() {
        for (var i = 0; i < allAnswers.length; i++) {
            allAnswers[i].classList.add('slide-right');
        }

        // После анимации переходим к следующему вопросу
        setTimeout(function() {
            moveToNextQuestion();
        }, 800);
    }, 1000);
}

// Добавляем маркер к вопросу
function addMarkerToQuestion(isCorrect) {
    var questionBlock = document.getElementById('question-' + currentQuestionIndex);
    var marker = document.createElement('span');
    marker.className = 'question-marker';
    marker.textContent = isCorrect ? '✓' : '✗';
    marker.style.color = isCorrect ? '#4caf50' : '#f44336';
    questionBlock.appendChild(marker);
}

// Переход к следующему вопросу
function moveToNextQuestion() {
    var questionBlock = document.getElementById('question-' + currentQuestionIndex);
    questionBlock.classList.add('answered');
    questionBlock.classList.remove('selected');
    answeredQuestions.push(currentQuestionIndex);

    // Проверяем, остались ли вопросы
    if (answeredQuestions.length === shuffledQuestions.length) {
        endQuiz();
    } else {
        // Очищаем область ответов
        document.getElementById('answersContainer').innerHTML = '';
        document.getElementById('statusMessage').textContent = 'Выберите следующий вопрос';
        currentQuestionIndex = -1;
        isAnswered = false;
    }
}

// Завершение викторины
function endQuiz() {
    allQuestionsAnswered = true;

    var statusMessage = document.getElementById('statusMessage');
    statusMessage.className = 'status-message finish';
    statusMessage.textContent = 'Вопросы закончились!';

    document.getElementById('answersContainer').innerHTML = '';

    // Делаем все вопросы снова кликабельными для просмотра ответов и меняем их цвет
    var allQuestions = document.querySelectorAll('.question-block');
    for (var i = 0; i < allQuestions.length; i++) {
        // Ищем соответствующий вопрос в массиве
        var questionIndex = parseInt(allQuestions[i].getAttribute('data-index'));
        var userAnswer = userAnswers[questionIndex];

        if (userAnswer) {
            allQuestions[i].classList.remove('answered');

            var bgColor = userAnswer.isCorrect ? '#4caf50' : '#f44336';

            // Устанавливаем все стили через cssText для гарантированного приоритета
            allQuestions[i].style.cssText = 'background-color: ' + bgColor + ' !important; ' +
                                             'color: white !important; ' +
                                             'border-color: ' + bgColor + ' !important; ' +
                                             'pointer-events: auto !important; ' +
                                             'cursor: pointer !important; ' +
                                             'opacity: 1 !important;';
        }
    }

    // Показываем статистику
    showStatistics();
}

// Показываем статистику
function showStatistics() {
    var percentage = Math.round((correctAnswers / shuffledQuestions.length) * 100);

    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = shuffledQuestions.length;
    document.getElementById('percentage').textContent = percentage;

    var statisticsPanel = document.getElementById('statisticsPanel');
    statisticsPanel.classList.remove('hidden');
}

// Показываем правильный ответ после завершения викторины
function showFinalAnswerForQuestion(questionBlock) {
    var index = parseInt(questionBlock.getAttribute('data-index'));
    var answersContainer = document.getElementById('answersContainer');

    answersContainer.innerHTML = '';

    var currentQuestion = shuffledQuestions[index];
    var userAnswer = userAnswers[index];

    // Если пользователь ответил правильно, показываем только правильный ответ
    if (userAnswer && userAnswer.isCorrect) {
        var correctAnswer = currentQuestion.answers.find(function(ans) {
            return ans.correct === true;
        });

        var answerBlock = document.createElement('div');
        answerBlock.className = 'answer-block correct';
        answerBlock.style.cursor = 'default';

        var answerText = document.createElement('div');
        answerText.className = 'answer-text';
        answerText.textContent = correctAnswer.text;

        answerBlock.appendChild(answerText);

        // Добавляем маркер
        var marker = document.createElement('div');
        marker.className = 'marker correct';
        answerBlock.appendChild(marker);

        // Добавляем пояснение
        var explanation = document.createElement('div');
        explanation.className = 'explanation show';
        explanation.textContent = currentQuestion.explanation;
        answerBlock.appendChild(explanation);

        answersContainer.appendChild(answerBlock);
    }
    // Если пользователь ответил неправильно, показываем все ответы
    else if (userAnswer && !userAnswer.isCorrect) {
        // Перемешиваем ответы (как при тесте)
        var shuffledAnswers = shuffleArray(currentQuestion.answers.slice());

        for (var i = 0; i < shuffledAnswers.length; i++) {
            var answerBlock = document.createElement('div');
            answerBlock.style.cursor = 'default';

            // Правильный ответ - подсвечиваем желтым
            if (shuffledAnswers[i].correct) {
                answerBlock.className = 'answer-block correct-highlight';

                // Добавляем пояснение под правильным ответом
                var answerText = document.createElement('div');
                answerText.className = 'answer-text';
                answerText.textContent = shuffledAnswers[i].text;
                answerBlock.appendChild(answerText);

                var explanation = document.createElement('div');
                explanation.className = 'explanation show';
                explanation.textContent = currentQuestion.explanation;
                answerBlock.appendChild(explanation);
            }
            // Неправильные ответы - серые
            else {
                answerBlock.className = 'answer-block disabled-answer';
                var answerText = document.createElement('div');
                answerText.className = 'answer-text';
                answerText.textContent = shuffledAnswers[i].text;
                answerBlock.appendChild(answerText);
            }

            answersContainer.appendChild(answerBlock);
        }
    }

    // Обновляем выделение вопроса
    var allQuestions = document.querySelectorAll('.question-block');
    for (var i = 0; i < allQuestions.length; i++) {
        allQuestions[i].classList.remove('selected');
    }
    questionBlock.classList.add('selected');
}
