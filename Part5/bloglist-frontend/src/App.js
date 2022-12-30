import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import LoginForm from "./components/Login"
import BlogForm from "./components/BlogForm.js"
import Togglable from "./components/Toggleable"
import blogService from "./services/blogs"
import loginService from "./services/login"

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState([null, "message"])
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const _blogs = blogs.map(b => {
        let _b = b
        _b.details = false
        return _b
      })
      setBlogs( _blogs )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (msg) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage([null, "message"])
    }, 5000)
  }

  const toggleBlogDetailVisibilityFun = (blogId) => {
    const toggleFun = () => {
      setBlogs(blogs.map(b => {
        if (b.id === blogId) {
          let newBlog = b
          newBlog.details = !b.details
          return newBlog
        } else {
          return b
        }
      }))
    }
    return toggleFun
  }

  const likeBlogFun = (blog) => {
    const likeFun = async () => {
      const errorHandler = (err) => {
        showNotification({ text: `blog could not be liked: ${err.response.data.error}`, type: "error" })
      }
      const liked = await blogService.likeBlog(blog, errorHandler)
      if (liked) {
        let newBlogs = blogs.map(b => {
          if (b.id === blog.id) {
            let _b = b
            _b.likes += 1
            return _b
          }
          return b
        })
        setBlogs(newBlogs)
      }
    }
    return likeFun
  }

  const blogDeleteFun = (blog) => {
    const delFun = async () => {
      const errorHandler = (err) => {
        showNotification({ text: `blog could not be deleted: ${err.response.data.error}`, type: "error" })
      }
      if (window.confirm("do you really want to delete this blog?")){
        const deleted = await blogService.deleteBlog(blog, errorHandler)
        if (deleted) {
          showNotification({ text: "blog successfully deleted", type: "message" })
          setBlogs(blogs.filter(b => {return (b.id !== blog.id)}))
        }
      }
    }
    return delFun
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("logging in with", username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      console.log("logged in with user", user)
    } catch (exception) {
      showNotification({ text: "Wrong credentials", type: "error" })
    }
  }

  const handleLogout = () => {
    // remove the user from the local Storage
    window.localStorage.removeItem("loggedBlogAppUser")
    // set token to null
    blogService.setToken(null)
    // set user to null and reset login input
    setUser(null)
    setUsername("")
    setPassword("")
  }

  const createBlog = async (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url
    }
    console.log("creating the blog", JSON.stringify(newBlog))
    const errorHandler = (err) => {
      showNotification({ text: `blog could not be created: ${err.response.data.error}`, type: "error" })
    }
    const posted = await blogService.createBlog(newBlog, errorHandler)
    if (posted) {
      // update the blog list
      showNotification({ text: "your new blog has been successfully created :)", type: "message" })
      blogFormRef.current.toggleVisibility()
      const newBlogs = blogs.concat(posted)
      console.log(posted)
      console.log(newBlogs)
      setBlogs(newBlogs)
    }
  }

  const onNameChange = (event) => {
    setUsername(event.target.value)
  }
  const onPwChange = (event) => {
    setPassword(event.target.value)
  }

  const loggedInView = () => {
    let displayBlogs = blogs.filter(b => true || b)
    displayBlogs.sort((a,b) => {
      return b.likes - a.likes
    })
    return (
      <div>
        <h2>user</h2>
        {user.name} <button type="button" onClick={handleLogout}>logout</button>
        <h2>blogs</h2>
        {displayBlogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            toggleDetails={toggleBlogDetailVisibilityFun(blog.id)}
            likeBlog={likeBlogFun(blog)}
            deleteBlog={blogDeleteFun(blog)}
            loggedInUser={user.username}
          />
        )}
        <Togglable buttonLabel="write blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h1>minttu Blogs</h1>
      <Notification message={message.text} className={message.type}/>

      {user === null && <LoginForm loginHandler={handleLogin} onNameChange={onNameChange} onPasswordChange={onPwChange}/> }
      {user !== null && loggedInView()}

    </div>
  )
}

export default App
