const AnecdoteList = ({ anecdotes, handleVote }) => {
  const sortedAnecdotes = [...anecdotes].sort((a,b) => {
    return (b.votes - a.votes)
  })
  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote.id)}>vote</button>
        </div>
      </div>
      )}
    </div>
  )
}

export default AnecdoteList