const categoryRepository = require("../repositories/categoryRepository");

async function getCategories(req, res, next) {
  try {
    const categories = await categoryRepository.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories };
