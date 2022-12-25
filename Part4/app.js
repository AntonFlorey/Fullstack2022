const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

// app modules
const logger= require("./utils/logger")
const config = require("./utils/config")
const blogsRouter = require("./controllers/blog")

// connect to DB
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).catch(err => {
  logger.error("error util works!")
  logger.error(err)
})

// set up middleware and controllers
app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogsRouter)

// set up a custom error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

module.exports = app