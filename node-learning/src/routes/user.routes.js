const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");

//Create
router.post("/user", createUser);

//READ
router.get("/users", getUsers);

// UPDATE
router.put("/user/:id", updateUser);

// DELETE
router.delete("/user/:id", deleteUser);

module.exports = router;