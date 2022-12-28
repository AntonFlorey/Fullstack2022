const blogsRouter = require("express").Router()
const Blog = require("./../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 }) 
  response.json(blogs)
})

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: "token missing" })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id 
  })
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: "token missing" })
  }
  // find the blog that should get deleted
  const toDelete = await Blog.findById(id)
  const originalUserId = toDelete.user.toString()

  if (!(originalUserId === user.id)) {
    return response.status(400).json({ error: "user is not the owner of this blog" })
  }

  try {
    await Blog.findByIdAndRemove(id)
    user.blogs = user.blogs.filter(bId => !(bId === toDelete._id))
    await user.save()
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
