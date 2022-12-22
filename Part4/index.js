// const http = require("http")

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

// app modules
const { info, error } = require("./utils/logger")
const config = require("./utils/config")
const blogsRouter = require("./controllers/blog")

// connect to DB
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).catch(err => {
  error("error util works!")
  error(err)
})

// set up middleware and controllers
app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogsRouter)

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})