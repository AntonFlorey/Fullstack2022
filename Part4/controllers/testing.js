const testingRouter = require("express").Router()
const Blog = require("./../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const helper = require("../tests/blogs_helper.js")
const cfg = require("../utils/config")

testingRouter.post("/reset", async (request, response) => {
  if (cfg.TESTING){
    console.log("resetting the test db...")
    // delete all blogs and users
    await Blog.deleteMany({})
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash("geheim", 10)
    const user = new User({ 
      username: "root", 
      name: "anton", 
      passwordHash: passwordHash 
    })
  
    const createdUser = await user.save()

    const blogObjects = helper.initial_blogs.map(b => {
      return (new Blog({
        title: b.title,
        author: b.author,
        url: b.url,
        likes: b.likes,
        user: createdUser._id 
      }))
    })
    const promiseArr = blogObjects.map(blog => {
      return (blog.save())
    })
    await Promise.all(promiseArr)
    console.log("finished resetting the test db")
    return response.status(201).end()
  }
})

module.exports = testingRouter