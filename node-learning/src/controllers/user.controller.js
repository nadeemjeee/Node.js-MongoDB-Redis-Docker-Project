const User = require("../models/user.model");
const { redisClient } = require("../config/redis");

const createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      age: req.body.age
    });

    await newUser.save();

    await redisClient.del("users");

    res.json({
      message: "User saved",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const cached = await redisClient.get("users");

    if (cached) {
      return res.json({
        message: "From Redis ⚡",
        data: JSON.parse(cached)
      });
    }

    const users = await User.find();

    await redisClient.set("users", JSON.stringify(users));

    res.json({
      message: "From MongoDB",
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers
};