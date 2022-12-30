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

const StatisticLine = ({text, data, type="number"}) => {
  if (type === "percentage"){
    return (
      <tr>
        <td>{text}:</td> 
        <td>{data}%</td>  
      </tr>
    )
  }
  return (
    <tr>
        <td>{text}:</td> 
        <td>{data}</td>  
      </tr>
  )
} 

const Stats = ({text, good, neutral, bad}) => {
  let num = good + neutral + bad
  if (num === 0){
    return (
      <>
      <h1>{text}</h1>
      <p>no feedback has been given yet</p>
      </>
    )
  }

  const compute_avg_score = () => {
    if (num === 0) {return(0)}
    return ((good - bad) / (good + bad + neutral))
  }
  const compute_pos_rate = () => {
    if (num === 0) {return(0)}
    return (100 * good / (good + bad + neutral))
  }

  return (
    <>
    <h1> {text} </h1>
    <p>
      <table>
        <StatisticLine text="good" data={good}/>
        <StatisticLine text="neutral" data={neutral}/>
        <StatisticLine text="bad" data={bad}/>
        <StatisticLine text="num votes" data={num}/>
        <StatisticLine text="avg score" data={compute_avg_score()}/>
        <StatisticLine text="positive ratio" data={compute_pos_rate()} type="percentage" />
      </table>
    </p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incGood = () => {setGood(good + 1)
  }
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