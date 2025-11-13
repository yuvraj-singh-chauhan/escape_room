document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let score = 0;
    let current = 0;
    let attempts = 0;
    let maxAttempts = 3;
    let timeLeft = 600; // 10 minutes in seconds
    let timerRunning = false;
    let timerInterval = null;

    // Questions array
    const questions = [
        {
            title: "🔌 PUZZLE 1",
            question: "I’m like an OR, but with a twist, Only one input must exist. If both are same, I say ‘No way!’ But if they differ, I light the way. What gate am I?",
            answer: "xor gate",
            hint: "This gate outputs true only when inputs are different."
        },
        {
            title: "⚡ PUZZLE 2",
            question: "In a hypothetical CPU, an instruction takes 4 cycles to execute. If the clock speed is 2 GHz, how long does one instruction take?",
            answer: "2 nanoseconds",
            hint: "Calculate time per cycle as 1 divided by frequency, then multiply by cycles per instruction."
        },
        {
            title: "🔒 PUZZLE 3",
            question: "A D flip-flop receives a clock pulse every 10 ns. If D = 1 for the first 3 pulses and 0 for the next 2, what’s the output after 5 pulses?",
            answer: "0",
            hint: "The output follows the D input at the last pulse."
        },
        {
            title: "🛠️ PUZZLE 4",
            question: "A 5-stage pipeline executes 100 instructions. If there are no stalls, how many cycles are needed?",
            answer: "104 cycles",
            hint: "Use the formula: stages + (instructions - 1)."
        },
        {
            title: "🔄 PUZZLE 5",
            question: "What is the output of this Python code? for i in range(3): print(i, end=", ")",
            answer: "0, 1, 2,",
            hint: "The loop runs from 0 to 2, and end parameter adds a comma and space."
        },
        {
            title: "🎭 PUZZLE 6",
            question: "The Memory Twin: I allocate memory, but I don’t initialize it. My sibling does both. Who are we?",
            answer: "malloc() and calloc()",
            hint: "These are C functions for memory allocation."
        },
        {
            title: "🧩 PUZZLE 7",
            question: "I turn source code into object code. But I don’t link or run it. What phase am I?",
            answer: "compilation",
            hint: "This step comes before linking."
        },
        {
            title: "📦 PUZZLE 8",
            question: "I’m close to the machine. I give you direct access to memory, but you must manage it yourself. I’m fast, but unforgiving. What language am I?",
            answer: "c",
            hint: "Known for pointers and manual memory management."
        },
        {
            title: "🐢 PUZZLE 9",
            question: "I don’t care about your type — if you act like it, I’ll treat you like it. What typing philosophy do I follow? Hint: Think of a bird that walks and quacks.",
            answer: "duck typing",
            hint: "If it looks like a duck and quacks like a duck, it’s a duck."
        },
        {
            title: "🧠 PUZZLE 10",
            question: "I store data in rows and columns, But I’m not a spreadsheet. I’m fast, volatile, and live close to the CPU. What am I?",
            answer: "cache memory",
            hint: "It’s a high-speed storage near the processor."
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
            alert("Time's up! You couldn't escape in 10 minutes.");
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
        resultMessage.textContent = passed ? 'You escaped successfully!' : 'You got trapped... Try again!';
    }

    function startGame() {
        score = 0;
        current = 0;
        attempts = 0;
        timeLeft = 600;
        timerEl.textContent = 'Time: 10:00';
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
    startBtn.addEventListener('click', () => {
        alert('Start Adventure clicked!');
        startGame();
    });
    instructionsBtn.addEventListener('click', () => {
        alert('Instructions clicked!');
        showScreen(instructionsScreen);
    });
    backBtn.addEventListener('click', () => {
        alert('Back clicked!');
        showScreen(welcomeScreen);
    });
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
