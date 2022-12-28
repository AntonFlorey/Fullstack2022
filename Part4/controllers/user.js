const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const cfg = require("../utils/config")

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: "username and password must be given"
    })
  }

  if (username.length < cfg.MIN_USERNAME_LEN) {
    return response.status(400).json({
      error: `username must be at least ${cfg.MIN_USERNAME_LEN} characters long`
    })
  }

  if (password.length < cfg.MIN_PW_LEN) {
    return response.status(400).json({
      error: `password must be at least ${cfg.MIN_PW_LEN} characters long`
    })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: "username is already taken"
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User ({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get("/", async (request, response) => {
  const users = await User
    .find({})
    .populate("blogs", { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter