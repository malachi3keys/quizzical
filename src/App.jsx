import { useState, useEffect } from 'react'
import  Intro from './components/Intro'
import  Question from './components/Question'
import './App.css'
import {decode} from 'html-entities'

export default function App() {
  const [showQ, setShowQ] = useState(false)
  const [questions, setQuestions] = useState([])
  const [randomAnswers, setRandomAnswers] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [checkAnswers, setCheckAnswers] = useState(false)
  const [finalScore, setFinalScore] = useState('')

  function startQuiz() {
    setShowQ(true)
  }

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
      .then((res) => res.json())
      .then((data) => setQuestions(data.results))
  },[showQ])


  const quiz = questions.map((q, index) => {
    //get rid of escaped characters 
    var newQuestion = decode(q.question)
    var correct = decode(q.correct_answer)
    
    //if randomAnswers is empty or the correct answer for a new question is not in randomAndswers
    //add new randomized answers to randomAnswers
    const test = (x) => x == correct  
    if(randomAnswers[index] == undefined || randomAnswers[index].findIndex(test) == -1){
      var answers = [q.correct_answer]
      answers.push(...q.incorrect_answers) //add incorrect answers to array

      //randomize answers
      for (var i = answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = decode(answers[i]);
        answers[i] = decode(answers[j]);
        answers[j] = temp;
      }

      setRandomAnswers(prevChoices => {
        return {
            ...prevChoices,
            [index]: answers
        }
      })
    } 

    return (
      <Question 
        key={index}
        id={index}
        question={newQuestion}
        answers={randomAnswers[index]}
        correct={correct}
        check={checkAnswers}
      />
    )
  })


  function updateAnswers(event) {
    event.preventDefault()
    const {name, value} = event.target
    setUserAnswers(prevAnswer => {
        return {
            ...prevAnswer,
            [name]: value
        }
    })
  }

  function gradeQuiz(event) {
    event.preventDefault()
    const userLength = Object.keys(userAnswers).length
    const qLength = Object.keys(questions).length

    if(userLength == qLength){
      setCheckAnswers(true)
      var score = 0
      
      for(let i=0; i < qLength; i++){
        // console.log(`user: ${userAnswers[i]} correct: ${questions[i].correct_answer}`)
        if(userAnswers[i] == questions[i].correct_answer){
          score = score + 1
        }
      }

      setFinalScore(`${score}/${qLength}`) 
    } else {
      alert('Please answer all questions')
    }    
  }

  function playAgain(){
    setShowQ(false)
    setUserAnswers([])
    setRandomAnswers([])
    setCheckAnswers(false)
    setFinalScore('')
  }

  return (
    <main className='App'>
      <div className='top-blob'></div>
      <div className={`intro ${showQ ? 'hidden' : ''}`}>
        <Intro 
          startQuiz={startQuiz}
        />
      </div>
      <div className={`quiz ${showQ ? '' : 'hidden'}`}>
        <form onSubmit={gradeQuiz}>
          <div onChange={(e) => updateAnswers(e)}>
            {quiz}  
          </div>
          <button className={`check-answers ${checkAnswers ? 'hidden' : ''}`}>
            Check answers
          </button>
        </form>
        {checkAnswers && <div className='score-div'>
          <div className='final-score'>You scored {finalScore} correct answers</div>
          <button 
            className='play-again'
            onClick={playAgain}
          >
            Play Again
          </button>
        </div>}
      </div> 
      <div className='bottom-blob'></div>     
    </main>
  )
}
