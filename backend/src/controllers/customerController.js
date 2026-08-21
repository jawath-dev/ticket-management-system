const customerRepository = require("../repositories/customerRepository");

async function getCustomers(req, res, next) {
  try {
    const customers = await customerRepository.getAllCustomers();
    res.status(200).json({ success: true, data: customers });
  } catch (err) {
    next(err);
  }
}

async function createCustomer(req, res, next) {
  try {
    const { name, email, phone } = req.body;
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

    const customerId = await customerRepository.createCustomer({
      name,
      email,
      phone,
    });
    const newCustomer = await customerRepository.getCustomerById(customerId);

    res.status(201).json({ success: true, data: newCustomer });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(err);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const customer = await customerRepository.getCustomerById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
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

    await customerRepository.updateCustomer(req.params.id, {
      name,
      email,
      phone,
    });
    const updatedCustomer = await customerRepository.getCustomerById(
      req.params.id,
    );

    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const customer = await customerRepository.getCustomerById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await customerRepository.deleteCustomer(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Cannot delete customer with existing tickets",
        });
    }
    next(err);
  }
}

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
