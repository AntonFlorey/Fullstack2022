const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./blogs_helper")
const Blog = require("../models/blog")
const logger = require("../utils/logger")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const cfg = require("../utils/config")
const jwt = require("jsonwebtoken")

const api = supertest(app)
let token = null

beforeEach(async () => {
  await User.deleteMany({})
  
  const passwordHash = await bcrypt.hash("sekret", 10)
  const user = new User({ username: "root", passwordHash })
  
  const createdUser = await user.save()

  await Blog.deleteMany({})
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

  const userForToken = {
    username: createdUser.username,
    id: createdUser._id,
  }
  token = jwt.sign(userForToken, cfg.SECRET)
})

describe("basic blog database functionality", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("application returns the correct amount number of blogs", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(helper.initial_blogs.length)
  })

  test("blogs contain an id field", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("Posting blogs", () => {
  test("posting a blog works", async () => {
    // login 
    const loginData = await api.post("/api/login")
      .send({ username: "root", password: "sekret" })

    logger.info(loginData.body)

    // post the blog 
    logger.info(token)
    await api.post("/api/blogs")
      .send(helper.toPost)
      .set("Authorization", "Bearer " + token)
    // get updated data
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(helper.initial_blogs.length + 1)
  })

  test("posting a blog without correct token does not work", async () => {
    await api.post("/api/blogs")
      .send(helper.toPost)
      .set("Authorization", "Bearer " + "wrong")
      .expect(401)
  })
    
  test("posting something without likes creates a blog with zero likes", async () => {
    const postedBlog = {
      title: helper.toPost.title,
      author: helper.toPost.author,
      url: helper.toPost.url
    }
    // post the blog
    await api.post("/api/blogs")
      .send(postedBlog)
      .set("Authorization", "Bearer " + token)
      .then((res) => {
        expect(res.body.likes).toBe(0)
      })
  })
    
  test("author missing leads to 400 bad request error", async () => {
    const postedBlog = {
      title: helper.toPost.title,
      url: helper.toPost.url
    }
    // post faulty blog
    await api.post("/api/blogs")
      .send(postedBlog)
      .set("Authorization", "Bearer " + token)
      .expect(400)
  })
    
  test("title missing leads to 400 bad request error", async () => {
    const postedBlog = {
      author: helper.toPost.author,
      url: helper.toPost.url
    }
    // post faulty blog
    await api.post("/api/blogs")
      .send(postedBlog)
      .set("Authorization", "Bearer " + token)
      .expect(400)
  })
})

describe("Deleting blogs", () => {
  test("deleting a blog works", async () => {
    const response = await api.get("/api/blogs")
    const del_id = response.body[0].id
    await api.delete(`/api/blogs/${del_id}`)
      .set("Authorization", "Bearer " + token)
      .expect(201)
    // check if element is deleted
    const response2 = await api.get("/api/blogs")
    expect(response2.body).toHaveLength(helper.initial_blogs.length - 1)
  })
})

describe("Updating blogs", () => {
  test("update the number of likes of one blog", async () => {
    // put entry to the database
    const posted = await api.post("/api/blogs").send(helper.toPost)
      .set("Authorization", "Bearer " + token)
    logger.info(posted.body)
    // update number of likes
    const update_info = {
      likes: helper.toPost.likes + 5
    }
    const updated = await api.put(`/api/blogs/${posted.body.id}`)
      .send(update_info)
    expect(updated.body.likes).toBe(helper.toPost.likes + 5)
  })
})

describe("user creation functionality", () => {
  
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }
  
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }, 20000)

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("username is already taken")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 20000)

  test("creation fails with proper statuscode and message if no username is given", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: "stupid name",
      password: "geheim",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("username and password must be given")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 20000)

  test("creation fails with proper statuscode and message if no password is given", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "user without pw",
      name: "stupid name"
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("username and password must be given")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 20000)

  test("creation fails with proper statuscode and message if password is to short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "user with bad",
      name: "stupid password",
      password: "a"
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(`password must be at least ${cfg.MIN_PW_LEN} characters long`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 20000)

  test("creation fails with proper statuscode and message if username is to short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "a",
      name: "short username",
      password: "geheim"
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(`username must be at least ${cfg.MIN_USERNAME_LEN} characters long`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  }, 20000)

})

afterAll(() => {
  mongoose.connection.close()
})
