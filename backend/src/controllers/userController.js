const userRepository = require("../repositories/userRepository");

async function getUsers(req, res, next) {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address",
        });
    }

    const userId = await userRepository.createUser({
      name,
      email,
      role: "agent",
    });
    const newUser = await userRepository.getUserById(userId);

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { name, email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address",
        });
    }

    await userRepository.updateUser(req.params.id, { name, email });
    const updatedUser = await userRepository.getUserById(req.params.id);

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    await userRepository.deleteUser(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Agent deleted successfully" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Cannot delete agent with assigned tickets",
        });
    }
    next(err);
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
