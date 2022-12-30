import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const createCurrentBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(blog)
  }

  return (
    <div>
      <h2>create blog</h2>
      <form onSubmit={createCurrentBlog}>
        <div>
          title <input type="text" placeholder="new blogs title" onChange={({ target }) => setTitle(target.value)} className="textInput"/>
        </div>
        <div>
          author <input type="text" placeholder="new blogs author" onChange={({ target }) => setAuthor(target.value)} className="authorInput"/>
        </div>
        <div>
          url <input type="text" placeholder="new blogs url" onChange={({ target }) => setUrl(target.value)} className="urlInput"/>
        </div>
        <button type='submit' className="formButton">create blog</button>
      </form>
    </div>
  )
}

export default BlogForm