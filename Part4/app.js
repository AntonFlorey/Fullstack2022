const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

// app modules
const logger= require("./utils/logger")
const config = require("./utils/config")
const middleware = require("./middleware")
const blogsRouter = require("./controllers/blog")
const usersRouter = require("./controllers/user")
const loginRouter = require("./controllers/login")

// connect to DB
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).catch(err => {
  logger.error("error util works!")
  logger.error(err)
})


// set up middleware and controllers

app.use(cors())
app.use(express.json())
app.use(middleware.tokenMiddleware)
app.use("/api/blogs", middleware.userExtractor, blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

// set up a custom error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" })
  }
}
app.use(errorHandler)

module.exports = app