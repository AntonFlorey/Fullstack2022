import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

describe("Blog Display Tests", () => {
  let blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 5,
    user: { name: "test user", username: "test username" },
    details: false
  }

  let likeFuncCalls = 0

  const toggleDetails = () => {
    blog.details = !blog.details
  }
  const likeFunc = () => {
    blog.likes += 1
    likeFuncCalls += 1
  }
  const dummyFunc = () => {
    return null
  }
  let container
  beforeEach(() => {
    container = render(<Blog blog={blog} toggleDetails={toggleDetails} likeBlog={likeFunc} deleteBlog={dummyFunc} loggedInUser="test username" />).container
  })

  test("renders title and author", () => {
    // screen.debug()
    const titleEelement = screen.getByText(/test title/)
    const author = screen.getByText(/test author/)
    expect(titleEelement).toBeDefined()
    expect(author).toBeDefined()
    // screen.debug()
  })

  test("does not render details at first", () => {
    const likesDetail = screen.queryByText(/likes:/)
    const urlDetail = screen.queryByText(/url:/)
    const detailDiv = container.querySelector(".blogDetails")
    expect(likesDetail).toBeNull()
    expect(urlDetail).toBeNull()
    expect(detailDiv).toBeNull()
    // screen.debug()
  })

  test("details are shown after detail button is pressed", async () => {
    const user = userEvent.setup()
    const detailButton = screen.getByText(/details/)
    await user.click(detailButton)

    render(<Blog blog={blog} toggleDetails={toggleDetails} likeBlog={likeFunc} deleteBlog={dummyFunc} loggedInUser="test username" />)
    const likesDetail = screen.getByText(/likes:/)
    const urlDetail = screen.getByText(/url:/)
    expect(likesDetail).toBeDefined()
    expect(urlDetail).toBeDefined()
  })

  test("clicking like twice calls the like handler twice", async () => {
    const user = userEvent.setup()
    const detailButton = screen.getByText(/details/)
    await user.click(detailButton)
    render(<Blog blog={blog} toggleDetails={toggleDetails} likeBlog={likeFunc} deleteBlog={dummyFunc} loggedInUser="test username" />)
    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)

    // now we should have called the function twice
    expect(likeFuncCalls).toBe(2)
    expect(blog.likes).toBe(7)
  })
})

describe("Blog Creation Form Tests", () => {
  test("the blog creation form calls the create function with correct parameters", async () => {
    const inputTitle = "test title"
    const inputAuthor = "test author"
    const inputUrl = "test url"

    const checkFunc = (blog) => {
      console.log(blog)
      expect(blog.title).toBe(inputTitle)
      expect(blog.author).toBe(inputAuthor)
      expect(blog.url).toBe(inputUrl)
    }

    const user = userEvent.setup()

    let container = render(<BlogForm createBlog={checkFunc} />).container
    const button = container.querySelector(".formButton")
    const titleInp = container.querySelector(".textInput")
    const authorInp = container.querySelector(".authorInput")
    const urlInp = container.querySelector(".urlInput")

    await user.type(titleInp, inputTitle)
    await user.type(authorInp, inputAuthor)
    await user.type(urlInp, inputUrl)
    await user.click(button)
  })
})