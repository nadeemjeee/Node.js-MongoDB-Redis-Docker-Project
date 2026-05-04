const User = require("../models/user.model");
const { redisClient } = require("../config/redis");

// CREATE
const createUser = async (req, res) => {
  try {
    const { name, age } = req.body;

    // validation
    if (!name || age === undefined) {
      return res.status(400).json({
        message: "Name and age are required"
      });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "Name must be a valid string"
      });
    }

    if (typeof age !== "number") {
      return res.status(400).json({
        message: "Age must be a number"
      });
    }

    const newUser = new User({ name, age });
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

// READ
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

// UPDATE
const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await redisClient.del("users");

    res.json({
      message: "User updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    await redisClient.del("users");

    res.json({
      message: "User deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};