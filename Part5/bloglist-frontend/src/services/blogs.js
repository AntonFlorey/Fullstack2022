import axios from "axios"
const baseUrl = "/api/blogs"
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (newBlog, errHandler) => {
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.post(baseUrl, newBlog, config)
    console.log(response)
    console.log(response.data)
    let createdBlog = response.data
    createBlog.details = false
    return createdBlog
  } catch (error) {
    errHandler(error)
    return null
  }
}

const likeBlog = async (blog, errHandler) => {
  const putUrl = baseUrl + `/${blog.id}`
  const config = {
    headers: { Authorization: token }
  }
  const data = {
    likes: blog.likes + 1
  }
  try {
    const response = await axios.put(putUrl, data, config)
    let createdBlog = response.data
    createBlog.details = false
    return createdBlog
  } catch (error) {
    errHandler(error)
    return null
  }
}

const deleteBlog = async (blog, errHandler) => {
  const delUrl = baseUrl + `/${blog.id}`
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.delete(delUrl, config)
    return response
  } catch (error) {
    errHandler(error)
    return null
  }
}

export default { getAll, setToken, createBlog, likeBlog, deleteBlog }