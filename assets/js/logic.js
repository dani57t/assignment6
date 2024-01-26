// --- Get all relevant HTML elements ---
var startScreen = document.getElementById('start-screen');  // Start Screen
var start = document.getElementById('start');               // Start button
var timer = document.getElementById('time');                // Timer display

var questions = document.getElementById('questions');       // Questions screen
var question = document.getElementById('question-title');   // Question display
var choices = document.getElementById('choices');           // Choices section
var feedback = document.getElementById('feedback');         // Area to display feedback to user

var endScreen = document.getElementById('end-screen');      // End screen
var finalScore = document.getElementById('final-score');    // Final score display
var initials = document.getElementById('initials');         // Initials form field
var submitScore = document.getElementById('submit');        // Submit score button

var highScores = document.getElementById('highscores');     // High scores list
var clearScores = document.getElementById('clear');         // Clear high scores button
if (localStorage.getItem('highscores') != null) {
    var scoresArr = JSON.parse(localStorage.getItem('highscores'));
    console.log(scoresArr);
} else {
    var scoresArr = [];
    var str = JSON.stringify(scoresArr);
    localStorage.setItem('highscores', str);
    console.log("Made an array");
}

// Create game variables
var countdown = 40;  // The game timer
var score = 0;      // The players score
var wrongAns = -5;  // Seconds to deduct for wrong answer
var stopTimer = false; // Timer stopper if user finishes all questions


var questionCounter = 0; // Keep track of which question we're on

// Sounds
var correctSound = new Audio('./assets/sfx/correct.wav');
var incorrectSound = new Audio('./assets/sfx/incorrect.wav');

// Timer countdown function
function timerCount() {
    var c = setInterval(function() {
        countdown--;    // Deduct 1 second from countdown
        timer.innerText = countdown;
        // If the countdown reaches 0, call gameEnd() function
        if (countdown <= 0 || stopTimer) {
            timer.innerText = 0;
            clearInterval(c);
            endGame();
        }
    }, 1000);
}

// Game start function
function startGame() {
    // Hide the start screen
    startScreen.style.display = "none";
    // Show the quiz
    showQuiz();
    // Begin the timer countdown
    timerCount();
}

// Show quiz function
function showQuiz() {
    // Obatain the current question using the questionCounter variable
    var currentQuestion = QAList[questionCounter];

    // Create button elements
    var b1 = document.createElement("button");
    var b2 = document.createElement("button");
    var b3 = document.createElement("button");
    var b4 = document.createElement("button");

    // Add the answers to the button's text
    b1.innerText = currentQuestion.answers.a
    b2.innerText = currentQuestion.answers.b
    b3.innerText = currentQuestion.answers.c
    b4.innerText = currentQuestion.answers.d

    // Display the button
    choices.appendChild(b1);
    choices.appendChild(b2);
    choices.appendChild(b3);
    choices.appendChild(b4);

    // Listen for button click
    b1.addEventListener('click', function() {
        removeButtons(b1, b2, b3, b4);
        handleAnswer("a");
    })
    b2.addEventListener('click', function() {
        removeButtons(b1, b2, b3, b4);
        handleAnswer("b");
    })
    b3.addEventListener('click', function() {
        removeButtons(b1, b2, b3, b4);
        handleAnswer("c");
    })
    b4.addEventListener('click', function() {
        removeButtons(b1, b2, b3, b4);
        handleAnswer("d");
    })

    // Show quiz question screen
    questions.classList.remove('hide');

    // Display the question in the question title box
    question.textContent = currentQuestion.question;

}

// Function to remove buttons from last question
function removeButtons(el1, el2, el3, el4) {
    choices.removeChild(el1);
    choices.removeChild(el2);
    choices.removeChild(el3);
    choices.removeChild(el4);
    return;
}

// Check the user's answer
function handleAnswer(ans) {
    // If the answer is correct, add to score
    // If incorrect, decrease timer
    if (ans === QAList[questionCounter].correct) {
        score++;
        correctSound.play();
        giveFeedback(true);
    } else {
        countdown += wrongAns;
        incorrectSound.play();
        giveFeedback(false);
    }

    // See how many questions are left
    // End game or display next question
    if (questionCounter >= QAList.length - 1) {
        stopTimer = true;
        endGame();
    } else {
        questionCounter++;
        showQuiz();
    }
}

// Display feedback to the user for 1 second
function giveFeedback(a) {
    var time = 1;
    // Show feedback area
    feedback.classList.remove('hide');
    var displayFeedback = setInterval(function() {
        if (time <= 0) {
            time = 1;
            feedback.classList.add('hide');
            clearInterval(displayFeedback);
        } else {
            if (a) {
                feedback.innerText =  "Correct!";
                time--;
            } else {
                feedback.innerText =  "Incorrect!";
                time--;
            }
        }
    }, 1000)
}

// Game end function
function endGame() {
    // Hide quiz screen
    questions.classList.add('hide');
    // Show the end screen
    endScreen.classList.remove('hide');
    // Show player's final score
    finalScore.innerText = score;
}

// Submit score function
function subScore() {
    // Display the highscores page
    location.href = './highscores.html';
    // store player's score and initials in an array
    var initScore = [initials.value, score];
    // push the array to a scores array where we store all highscores
    scoresArr.push(initScore);
    // Sort the array so that highest scores come first
    // Bubble sort
    var swap;
    for (var i = 0; i < scoresArr.length - 1; i++) {
        for (var j = 0; j < scoresArr.length - 1; j++) {
            if (scoresArr[i][1] < scoresArr[j + 1][1]) {
                swap = scoresArr[j + 1];
                scoresArr[j + 1] = scoresArr[i];
                scoresArr[i] = swap;
            }
        }
    }
    console.log(scoresArr);
    // stringify the array and add it to localstorage
    var str = JSON.stringify(scoresArr); 
    localStorage.setItem('highscores', str);

    return;
}


start.addEventListener('click', startGame);
submitScore.addEventListener('click', subScore);

