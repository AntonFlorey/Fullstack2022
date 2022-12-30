
const AnecdoteForm = ({ createAnecdote }) => {
  const anecCreator = (event) => {
    event.preventDefault()
    const content = event.target.anec.value
    createAnecdote(content)
  }
  return (
      <div>
        <h2>create new</h2>
        <form onSubmit={anecCreator}>
          <div><input name="anec" placeholder="new anecdote"/></div>
          <button type="submit">create</button>
        </form>
      </div>
  )
}

export default AnecdoteForm