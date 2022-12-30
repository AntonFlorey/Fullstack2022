/* global process */

require("dotenv").config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === "test" 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET

const MIN_PW_LEN = 3
const MIN_USERNAME_LEN = 3

const TESTING = (process.env.NODE_ENV === "test")

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  MIN_PW_LEN,
  MIN_USERNAME_LEN,
  TESTING
}