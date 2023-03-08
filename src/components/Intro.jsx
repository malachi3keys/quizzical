export default function Intro(props) {
    return (
        <div>
            <h1 className='title'>Quizzical</h1>
            <p className='subtitle'>Trivia questions</p>
            <button className='start-btn'
                onClick={() => props.startQuiz()}
            >Start Quiz</button>
        </div>
    )
}

