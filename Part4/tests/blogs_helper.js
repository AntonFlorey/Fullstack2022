const User = require("../models/user")
const Blog = require("../models/blog")

const initial_blogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Go To Statement Considered Harmful v2",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 10
  },
  {
    title: "Hello World - An introduction to giving birth",
    author: "Neumann",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 17
  }
]

const toPost = {
  title: "This is a test",
  author: "tester",
  url: "dummy.com",
  likes: 5,
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initial_blogs,
  toPost,
  blogsInDb,
  usersInDb
}