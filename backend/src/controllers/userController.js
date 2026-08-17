const userRepository = require("../repositories/userRepository");

async function getUsers(req, res, next) {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers };
