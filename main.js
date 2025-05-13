const subjects = {
  Physics: ['UDME','vectors','calculus','kinematics','NLM','circular motion','work,power, energy','center of mass','rotation','gravitation','heat'],
  Chemistry: ['Mole concept','Atomic structure','periodic table','chemical bonding','gaseous state','thermo-D','equilibrium','IUPAC','Goc','isomerism'],
  Maths: ['Trogo ratio','quadratic','trigo eqn','inequalities','SnS','Binomial','PnC','probo','straight lines','Circles','fumctions','ITF']
};

const subjectSelect = document.getElementById('subject-select');
const chapterSelect = document.getElementById('chapter-select');
const startBtn = document.getElementById('start-btn');
const selectionScreen = document.getElementById('selection-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const answerContainer = document.getElementById('answer-container');
const revealBtn = document.getElementById('reveal-btn');
const nextBtn = document.getElementById('next-btn');

let currentQuestions = [];
let currentIndex = 0;

// Populate subject dropdown
for (let subject in subjects) {
  const option = document.createElement('option');
  option.value = subject;
  option.textContent = subject;
  subjectSelect.appendChild(option);
}

// Handle subject selection
subjectSelect.addEventListener('change', () => {
  const selectedSubject = subjectSelect.value;
  chapterSelect.innerHTML = '<option value="">Choose Chapter</option>';
  if (selectedSubject) {
    subjects[selectedSubject].forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter;
      option.textContent = chapter;
      chapterSelect.appendChild(option);
    });
    chapterSelect.disabled = false;
  } else {
    chapterSelect.disabled = true;
    startBtn.disabled = true;
  }
});

// Handle chapter selection
chapterSelect.addEventListener('change', () => {
  startBtn.disabled = !chapterSelect.value;
});

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start flashcards
startBtn.addEventListener('click', () => {
  const subject = subjectSelect.value.toLowerCase();
  const chapter = chapterSelect.value.toLowerCase().replace(/\s+/g, '_');
  const fileName = `${subject}/${chapter}.json`;

  fetch(`data/${fileName}`)
    .then(response => response.json())
    .then(data => {
      currentQuestions = data;
      shuffleArray(currentQuestions);
      currentIndex = 0;
      selectionScreen.classList.add('hidden');
      flashcardScreen.classList.remove('hidden');
      showQuestion();
    })
    .catch(error => {
      alert('Error loading questions.');
      console.error(error);
    });
});

// Show current question
function showQuestion() {
  if (currentIndex >= currentQuestions.length) {
    alert("completed");
    location.reload(); // or reset state manually
    return;
  }

  const current = currentQuestions[currentIndex];
  try {
    katex.render(current.question, questionText, { throwOnError: false });
  } catch (err) {
    questionText.textContent = current.question;
  }

  answerText.innerHTML = '';
  answerContainer.classList.add('hidden');
}

// Reveal answer
revealBtn.addEventListener('click', () => {
  const current = currentQuestions[currentIndex];
  answerContainer.classList.remove('hidden');
  try {
    katex.render(current.answer, answerText, { throwOnError: false });
  } catch (err) {
    answerText.textContent = current.answer;
  }
});

// Next question
nextBtn.addEventListener('click', () => {
  currentIndex += 1;
  showQuestion();
});
