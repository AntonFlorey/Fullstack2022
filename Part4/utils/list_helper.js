const dummy = (blogs) => {
  return (1)
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + Number(blog.likes)
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let result = {
        title: "The provided list is empty",
        author: "undefined",
        likes: -1
    }
    blogs.forEach(blog => {
        if (blog.likes > result.likes) {
            result.likes = blog.likes
            result.author = blog.author
            result.title = blog.title
        }
    });
    return (result)
}

const mostBlogs = (blogs) => {
    let authors = {}
    blogs.forEach(blog => {
        const auth = blog.author
        if (!(auth in authors)) {
            authors[auth] = 0
        }
        authors[auth] += 1
    })
    let result = {
        author: "none",
        blogs: -1
    }
    for (let auth in authors) {
        const blogs = authors[auth]
        if (blogs > result.blogs) {
            result.author = auth
            result.blogs = blogs
        }
    }
    return (result)
}

const mostLikes = (blogs) => {
    let authors = {}
    blogs.forEach(blog => {
        const auth = blog.author
        if (!(auth in authors)) {
            authors[auth] = 0
        }
        authors[auth] += blog.likes
    })
    let result = {
        author: "none",
        likes: -1
    }
    for (let auth in authors) {
        const likes = authors[auth]
        if (likes > result.likes) {
            result.author = auth
            result.likes = likes
        }
    }
    return (result)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

