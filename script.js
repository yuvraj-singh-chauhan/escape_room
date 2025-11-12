document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let score = 0;
    let current = 0;
    let attempts = 0;
    let maxAttempts = 3;
    let timeLeft = 300; // 5 minutes in seconds
    let timerRunning = false;
    let timerInterval = null;

    // Questions array
    const questions = [
        {
            title: "🐍 PUZZLE 1",
            question: "What is the output of: print(list(zip([1,2], [3,4])))?",
            answer: "[(1, 3), (2, 4)]",
            hint: "Zip pairs up elements from multiple iterables."
        },
        {
            title: "⚙️ PUZZLE 2",
            question: "What is the result of: print(1 // 2 * 3)?",
            answer: "0",
            hint: "Floor division and multiplication precedence."
        },
        {
            title: "🧮 PUZZLE 3",
            question: "What does this return: print([].append(1))?",
            answer: "none",
            hint: "Append modifies in-place and returns None."
        },
        {
            title: "💾 PUZZLE 4",
            question: "What is the output of: print({1, 2, 2, 3})?",
            answer: "{1, 2, 3}",
            hint: "Sets automatically remove duplicates."
        },
        {
            title: "🔁 PUZZLE 5",
            question: "What is printed by: print(lambda x: x)(5)?",
            answer: "5",
            hint: "Lambda functions can be called immediately."
        },
        {
            title: "🎭 PUZZLE 6",
            question: "What is the output of: print('a'.join(['1', '2']))?",
            answer: "1a2",
            hint: "Join uses the string as a separator."
        },
        {
            title: "🧩 PUZZLE 7",
            question: "What is the result of: print(2 ** 3 ** 2)?",
            answer: "512",
            hint: "Exponentiation is right-associative."
        },
        {
            title: "📦 PUZZLE 8",
            question: "What will this print: print(int('0x10', 16))?",
            answer: "16",
            hint: "Converting hexadecimal string to integer."
        },
        {
            title: "🐢 PUZZLE 9",
            question: "What is the output of: print([i for i in range(5) if i % 2][0])?",
            answer: "1",
            hint: "List comprehension with condition, first odd number."
        },
        {
            title: "🧠 PUZZLE 10",
            question: "What does this return: print(all([True, False, True]))?",
            answer: "false",
            hint: "All returns True only if every element is True."
        }
    ];

    // DOM elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const instructionsBtn = document.getElementById('instructions-btn');
    const backBtn = document.getElementById('back-btn');
    const puzzleTitle = document.getElementById('puzzle-title');
    const questionCount = document.getElementById('question-count');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const progressBar = document.getElementById('progress');
    const questionEl = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const feedbackEl = document.getElementById('feedback');
    const hintEl = document.getElementById('hint');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    const resultMessage = document.getElementById('result-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const exitBtn = document.getElementById('exit-btn');

    // Helper functions
    function showScreen(screen) {
        welcomeScreen.classList.remove('active');
        instructionsScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        resultScreen.classList.remove('active');
        screen.classList.add('active');
    }

    function updateTimer() {
        if (timerRunning && timeLeft > 0) {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else if (timeLeft <= 0) {
            timerRunning = false;
            timerEl.textContent = 'Time: 0:00';
            timerEl.style.color = '#ff0000';
            clearInterval(timerInterval);
            alert("Time's up! You couldn't escape in 5 minutes.");
            showResult();
        }
    }

    function startTimer() {
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        timerRunning = false;
        clearInterval(timerInterval);
    }

    function showQuestion() {
        if (current >= questions.length) {
            stopTimer();
            showResult();
            return;
        }
        const q = questions[current];
        puzzleTitle.textContent = q.title;
        questionCount.textContent = `Q${current + 1}/10`;
        scoreEl.textContent = `Score: ${score}`;
        progressBar.style.width = `${((current) / questions.length) * 100}%`;
        questionEl.textContent = q.question;
        answerInput.value = '';
        feedbackEl.textContent = '';
        hintEl.textContent = '';
        answerInput.focus();
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = questions[current].answer.toLowerCase();
        const hint = questions[current].hint;

        if (userAnswer === correctAnswer) {
            feedbackEl.textContent = '✅ Correct!';
            feedbackEl.style.color = '#00ff00';
            score++;
            setTimeout(nextQuestion, 1000);
        } else {
            attempts++;
            const remaining = maxAttempts - attempts;
            if (remaining > 0) {
                feedbackEl.textContent = `❌ Wrong! Attempts left: ${remaining}`;
                feedbackEl.style.color = '#ff6666';
                if (attempts === 2) {
                    hintEl.textContent = `💡 Hint: ${hint}`;
                }
            } else {
                feedbackEl.textContent = `❌ Out of attempts! Answer: ${correctAnswer.toUpperCase()}`;
                feedbackEl.style.color = '#ff6666';
                setTimeout(nextQuestion, 1500);
            }
        }
    }

    function nextQuestion() {
        current++;
        attempts = 0;
        showQuestion();
    }

    function showResult() {
        showScreen(resultScreen);
        const passed = score >= 5;
        resultTitle.textContent = passed ? '🏆 ESCAPED!' : '🔒 TRAPPED!';
        resultTitle.style.color = score >= 7 ? '#00ffaa' : '#ff5555';
        resultScore.textContent = `Score: ${score}/10`;
        resultMessage.textContent = passed ? 'You escaped the Python dungeon!' : 'You got trapped in the infinite loop... Try again!';
    }

    function startGame() {
        score = 0;
        current = 0;
        attempts = 0;
        timeLeft = 300;
        timerEl.textContent = 'Time: 5:00';
        timerEl.style.color = '#ffcc00';
        startTimer();
        showScreen(gameScreen);
        showQuestion();
    }

    function showHintEarly() {
        if (attempts < 2 && hintEl.textContent === '') {
            hintEl.textContent = `💡 Hint: ${questions[current].hint}`;
        } else if (hintEl.textContent !== '') {
            hintEl.textContent = '';
        }
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    instructionsBtn.addEventListener('click', () => showScreen(instructionsScreen));
    backBtn.addEventListener('click', () => showScreen(welcomeScreen));
    submitBtn.addEventListener('click', checkAnswer);
    hintBtn.addEventListener('click', showHintEarly);
    playAgainBtn.addEventListener('click', startGame);
    exitBtn.addEventListener('click', () => showScreen(welcomeScreen));

    // Allow submit on Enter key
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
});
