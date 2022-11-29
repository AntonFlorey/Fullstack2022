import { useState } from 'react'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  console.log(points)

  const selectRandom = () => {
    let num = Math.floor(Math.random() * anecdotes.length)
    console.log(num)
    setSelected(num)
  }

  const voteCurrent = () => {
    let cpy = [...points]
    cpy[selected] += 1
    setPoints(cpy)
  }

  const mostVoted = () => {
    let max_id = 0
    let maxVotes = -1
    for (let i =  0; i < anecdotes.length; i++){
      if (points[i] > maxVotes){
        maxVotes = points[i]
        max_id = i
      }
    }
    return (max_id)
  }

  return (
    <div>
      <h1>Here is a random anecdote for you</h1>
      {anecdotes[selected]} <br/>
      has {points[selected]} votes <br/>
      <Button text="vote" onClick={voteCurrent} />
      <Button text="next anecdote" onClick={selectRandom} />
      <h1>Most popular anecdote</h1>
      <p>
        {anecdotes[mostVoted()]} <br/>
        has {points[mostVoted()]} votes
      </p>

    </div>
  )
}

export default App