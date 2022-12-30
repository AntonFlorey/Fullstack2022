import { useSelector, useDispatch } from 'react-redux'
import { voteFor, addAnec } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const anecdotes = useSelector(state => state).anecdotes
  console.log("lol:")
  console.log(anecdotes)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteFor(id))
  }

  const write = (text) => {
    console.log("writing:", text, "...")
    dispatch(addAnec(text))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList anecdotes={anecdotes} handleVote={vote} />
      <AnecdoteForm createAnecdote={write} />
    </div>
  )
}

export default App