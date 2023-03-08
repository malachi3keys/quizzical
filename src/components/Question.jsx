import { useState } from 'react'
import { nanoid } from 'nanoid'

export default function Question(props) {    
    const multChoice = props.answers
    const qName = props.id
    const [selected, setSelected] = useState({
        [qName]: ''
    })


    function answerChange(event) {
        const {name, value, type, checked} = event.target
        setSelected(prevAnswer => {
            return {
                ...prevAnswer,
                [name]: type === "checkbox" ? checked : value
            }
        })      
    }
    
    const choices = multChoice.map((a) => {
        //Styles for scoring quiz
        var test = ''
        if (props.check){
            if (a == props.correct){
                test = 'correct'
            } else if (a ==  selected[qName]) {
                test = 'incorrect fade'
            } else {
                test = 'fade'
            }
        } 

        return (
            <div key={nanoid()}>
                <label>
                    <input 
                        type='radio'
                        name={qName}
                        value={a}
                        checked={selected[qName] === a}
                        onChange={answerChange}
                        className='radio-btn'
                        disabled={props.check ? true : false}
                    />
                    <div className={`answer-btn ${selected[qName] == a ? 'selected' : ''} ${test}`}>
                        {a}
                    </div>
                </label>
            </div>
        )
      })


    return (
        <div className='question'>
            <h2 className='question-title'>{props.question}</h2>
            <div className='answer-div'>{choices}</div>
            <hr className='borderline'></hr>    
        </div>
    )
}