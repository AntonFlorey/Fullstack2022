const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, default: "default_name" },
  passwordHash: { type: String, required: true },
  blogs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }
  ]
})

userSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    // the passwordHash should not be revealed
    delete returnedObj.passwordHash
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User