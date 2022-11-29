import { useState } from 'react'

const FeedbackButton = ({text, onClick}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Feedback = ({header, buttons}) => {
  return (
    <div>
      <h1>{header}</h1>
      <FeedbackButton text={buttons[0].text} onClick={buttons[0].func} />
      <FeedbackButton text={buttons[1].text} onClick={buttons[1].func} />
      <FeedbackButton text={buttons[2].text} onClick={buttons[2].func} />
    </div>
  )
}

const Stats = ({text, good, neutral, bad}) => {
  return (
    <>
    <h1> {text} </h1>
    <p>
      good: {good} <br />
      neutral: {neutral} <br />
      bad: {bad} 
    </p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incGood = () => {setGood(good + 1)}
  const incNeutral = () => {setNeutral(neutral + 1)}
  const incBad = () => {setBad(bad + 1)}

  const header = 'Give Feedback'
  const stats_header = 'Stats'
  const buttons = [
    {text: 'good',
     func: incGood 
    },
    {text: 'neutral',
     func: incNeutral 
    },
    {text: 'bad',
     func: incBad 
    }
  ]

  return (
    <div>
      <Feedback header={header} buttons={buttons} />
      <Stats text={stats_header} good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App