'use script';
// クラスの設計
class Quiz {
  constructor(quizData) {
    this._quizzes = quizData.results; //この中にクイズの内容、回答、難易度等のデータが入ってる
    this._correctAnswersNum = 0;
  }

  getQuizCategory(quizIndex) {
    return this._quizzes[quizIndex - 1].category;
  }
  getQuizDifficulty(quizIndex) {
    return this._quizzes[quizIndex - 1].difficulty;
  }
  getQuizQuestion(quizIndex) {
    return this._quizzes[quizIndex - 1].question;
  }

  getNumOfQuiz() {
    return this._quizzes.length;
  }
  getCorrectAnswer(quizIndex) {
    return this._quizzes[quizIndex - 1].correct_answer;
  }
  getIncorrectAnswer(quizIndex) {
    return this._quizzes[quizIndex - 1].incorrect_answers;
  }
  countCorrectAnswersNum(quizIndex, answer) {
    const correctAnswer = this._quizzes[quizIndex - 1].correct_answer;
    if (answer === correctAnswer) {
      this._correctAnswersNum++;
    }
  }
  getCorrectAnswerNum() {
    return this._correctAnswersNum;
  }
}

const titleElement = document.getElementById('title_text');
const questionElement = document.getElementById('question');
const genreElement = document.getElementById('genre');
const difficultyElement = document.getElementById('difficulty');
const startButton = document.getElementById('start_quiz');
const answersArea = document.getElementById('answersArea');

startButton.addEventListener('click', () => {
  startButton.hidden = true;
  fetchQuizData(1);
});

// 非同期処理
const fetchQuizData = async (index) => {
  titleElement.innerHTML = '取得中';
  questionElement.innerHTML = '少々お待ちください';

  const res = await fetch('https://opentdb.com/api.php?amount=10')
    .then((res) => res)
    .catch((error) => console.log(error));
  const quizData = await res.json();
  const quiz = new Quiz(quizData); //Quizクラス呼び出し
  console.log(quizData.results);
  setNextQuiz(quiz, index);
};

//indexは、makeQuizの引数indexに入る
const setNextQuiz = (quiz, index) => {
  while (answersArea.firstChild) {
    answersArea.removeChild(answersArea.firstChild);
  }

  //ここのindexにfetchQuizData内で指定したindex番号[1]が入ってくる
  if (index <= quiz.getNumOfQuiz()) {
    makeQuiz(quiz, index);
  } else {
    finishQuiz(quiz);
  }
};

//回答ボタンの作成、問題関連のブラウザへの表示の実装
//makeQuizのindexがgetQuizCategoryメソッドの引数であるquizIndexに入る
const makeQuiz = (quiz, index) => {
  titleElement.innerHTML = `問題 ${index}`;
  genreElement.innerHTML = `[ジャンル] ${quiz.getQuizCategory(index)}`;
  difficultyElement.innerHTML = `[難易度] ${quiz.getQuizDifficulty(index)}`;
  questionElement.innerHTML = `${quiz.getQuizQuestion(index)}`;

  const answers = BuildAnswers(quiz, index);

  answers.forEach((answer) => {
    const answerElement = document.createElement('li');
    answersArea.appendChild(answerElement);

    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = answer;
    answersArea.appendChild(buttonElement);
    buttonElement.addEventListener('click', () => {
      quiz.countCorrectAnswersNum(index, answer);
      index++;
      setNextQuiz(quiz, index);
    });
  });
};

const finishQuiz = (quiz) => {
  titleElement.innerHTML = `あなたの正答数は ${quiz.getCorrectAnswerNum()}です!!`;
  genreElement.innerHTML = '';
  difficultyElement.innerHTML = '';
  questionElement.innerHTML = '再度挑戦したい方は以下をクリック!';
  const restartButton = document.createElement('button');
  restartButton.innerHTML = 'ホームに戻る';
  answersArea.appendChild(restartButton);

  restartButton.addEventListener('click', () => {
    location.reload();
  });
};

const BuildAnswers = (quiz, index) => {
  const answers = [
    quiz.getCorrectAnswer(index),
    ...quiz.getIncorrectAnswer(index)
  ];
  return shuffleArray(answers);
};

const shuffleArray = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
