const mongoose = require("mongoose");

// define structure of user
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

// create model
const User = mongoose.model("User", userSchema);

module.exports = User;