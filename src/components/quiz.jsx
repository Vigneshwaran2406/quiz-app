

import './quiz.css';
import React, { useRef, useState, useEffect } from 'react';
import { data } from '../assets/data';

const Quiz = () => {
  
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timer, setTimer] = useState(15);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);
  const optionArray = [option1, option2, option3, option4];

  // Timer countdown effect
  useEffect(() => {
    if (lock || result) return;
    if (timer === 0) {
      setLock(true);
      optionArray[question.ans - 1].current.classList.add('correct');
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, lock, question, result]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add('wrong');
        optionArray[question.ans - 1].current.classList.add('correct');
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
      } else {
        const newIndex = index + 1;
        setIndex(newIndex);
        setQuestion(data[newIndex]);
        setTimer(15);
        setLock(false);
        optionArray.forEach((option) => {
          option.current.classList.remove('wrong', 'correct');
        });
      }
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setTimer(15);
    setLock(false);
    setResult(false);
    optionArray.forEach((option) => {
      option.current.classList.remove('wrong', 'correct');
    });
  };

  const getResultText = () => {
    const percent = (score / data.length) * 100;
    if (percent >= 80) return ' Excellent!';
    if (percent >= 50) return ' Good Job!';
    return ' Try Again!';
  };

  return (
    <div className='container'>
      <h1>React Quiz App</h1>
      <hr />
      {result ? (
        <>
          <h2>Your Score: {score} / {data.length}</h2>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: `${(score / data.length) * 100}%` }}
            ></div>
          </div>
          <h3>{getResultText()}</h3>
          <button onClick={reset}>Restart Quiz</button>
        </>
      ) : (
        <>
          <div className='timer'>⏱️ {timer} sec</div>
          <h2>{index + 1}. {question.question}</h2>
          <ul>
            <li ref={option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
            <li ref={option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
            <li ref={option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
            <li ref={option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={next}>Next</button>
          <div className='index'>{index + 1} of {data.length} Questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;
