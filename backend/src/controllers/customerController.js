const customerRepository = require("../repositories/customerRepository");

async function getCustomers(req, res, next) {
  try {
    const customers = await customerRepository.getAllCustomers();
    res.status(200).json({ success: true, data: customers });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCustomers };
