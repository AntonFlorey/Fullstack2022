const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const settings = require("./test_settings")
const Blog = require("../models/blog")
const logger = require("../utils/logger")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = settings.initial_blogs.map(b => {
    return (new Blog(b))
  })
  const promiseArr = blogObjects.map(blog => {
    return (blog.save())
  })
  await Promise.all(promiseArr)
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
    expect(response.body).toHaveLength(settings.initial_blogs.length)
  })

  test("blogs contain an id field", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("Posting blogs", () => {
  test("posting a blog works", async () => {
    // post the blog 
    await api.post("/api/blogs").send(settings.toPost)
    // get updated data
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(settings.initial_blogs.length + 1)
  })
    
  test("posting something without likes creates a blog with zero likes", async () => {
    const postedBlog = {
      title: settings.toPost.title,
      author: settings.toPost.author,
      url: settings.toPost.url
    }
    // post the blog
    await api.post("/api/blogs").send(postedBlog)
      .then((res) => {
        expect(res.body.likes).toBe(0)
      })
  })
    
  test("author missing leads to 400 bad request error", async () => {
    const postedBlog = {
      title: settings.toPost.title,
      url: settings.toPost.url
    }
    // post faulty blog
    await api.post("/api/blogs")
      .send(postedBlog)
      .expect(400)
  })
    
  test("title missing leads to 400 bad request error", async () => {
    const postedBlog = {
      author: settings.toPost.author,
      url: settings.toPost.url
    }
    // post faulty blog
    await api.post("/api/blogs")
      .send(postedBlog)
      .expect(400)
  })
})

describe("Deleting blogs", () => {
  test("deleting a blog works", async () => {
    const response = await api.get("/api/blogs")
    const del_id = response.body[0].id
    await api.delete(`/api/blogs/${del_id}`)
      .expect(201)
    // check if element is deleted
    const response2 = await api.get("/api/blogs")
    expect(response2.body).toHaveLength(settings.initial_blogs.length - 1)
  })
})

describe("Updating blogs", () => {
  test("update the number of likes of one blog", async () => {
    // put entry to the database
    const posted = await api.post("/api/blogs").send(settings.toPost)
    logger.info(posted.body)
    // update number of likes
    const update_info = {
      likes: settings.toPost.likes + 5
    }
    const updated = await api.put(`/api/blogs/${posted.body.id}`)
      .send(update_info)
    expect(updated.body.likes).toBe(settings.toPost.likes + 5)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
