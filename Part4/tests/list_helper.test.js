const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require("../utils/list_helper.js")

test("dummy test", () => {
  const result = dummy(["bla"])

  expect(result).toBe(1)
}) 

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ]

  test("when list has only one blog, equals the likes of that", () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe("favorite blog", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ]
  const listWithTwoEquallyPopularBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Go To Statement Considered Harmful v2",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 1
    }
  ]
  const listWithThreeBlogs = [
    {
      _id: "1",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "2",
      title: "Go To Statement Considered Harmful v2",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 1
    },
    {
      _id: "3",
      title: "Hello World - An introduction to giving birth",
      author: "Neumann",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 12,
      __v: 1
    }
  ]

  test("When the list has only one blog, its the favorite one", () => {
    const result = favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: listWithOneBlog[0].title,
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes
    })
  })

  test("When two blogs are equally popular, return any of them", () => {
    const result = favoriteBlog(listWithTwoEquallyPopularBlogs)
    expect(result.likes).toBe(5)
  })

  test("A list with multiple blogs should also work", () => {
    const result = favoriteBlog(listWithThreeBlogs)
    expect(result).toEqual({
      title: listWithThreeBlogs[2].title,
      author: listWithThreeBlogs[2].author,
      likes: listWithThreeBlogs[2].likes
    })
  })

})

describe("Most blogs", () => {
  const listWithTwoAuthors = [
    {
      _id: "1",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "2",
      title: "Go To Statement Considered Harmful v2",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 1
    },
    {
      _id: "3",
      title: "Hello World - An introduction to giving birth",
      author: "Neumann",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 12,
      __v: 1
    }
  ]

  test("A test with two authors", () => {
    const result = mostBlogs(listWithTwoAuthors)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 2
    })
  })
})

describe("Most likes", () => {
  const listWithTwoAuthors = [
    {
      _id: "1",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "2",
      title: "Go To Statement Considered Harmful v2",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 1
    },
    {
      _id: "3",
      title: "Hello World - An introduction to giving birth",
      author: "Neumann",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 17,
      __v: 1
    }
  ]

  test("A test with two authors", () => {
    const result = mostLikes(listWithTwoAuthors)
    expect(result).toEqual({
      author: "Neumann",
      likes: 17
    })
  })
})