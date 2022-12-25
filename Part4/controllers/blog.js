const blogsRouter = require("express").Router()
const Blog = require("./../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}) 
  response.json(blogs)
})

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body)
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id
  try {
    await Blog.findByIdAndRemove(id)
    response.status(201).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id
  const newContent = request.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, newContent, { new: true, runValidators: true, context: "query" })
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
