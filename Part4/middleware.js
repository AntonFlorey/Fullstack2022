const User = require("./models/user")
const jwt = require("jsonwebtoken")
const cfg = require("./utils/config")

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}
  
const tokenMiddleware = (req, res, next) => {
  const extracted_token = getTokenFrom(req)
  req.token = extracted_token 
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    request.user = undefined
    return next()
  }
  try {
    const decodedToken = await jwt.verify(token, cfg.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    } 
    const user = await User.findById(decodedToken.id)
    if (user === null || user === undefined){
      return response.status(401).json({ error: "user is not existing" })
    }
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  tokenMiddleware,
  userExtractor
}