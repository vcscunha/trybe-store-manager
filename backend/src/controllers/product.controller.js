const productService = require('../services/product.service');

const getAllProducts = async (_req, res) => {
  const result = await productService.getAllProducts();
  return res.status(200).json(result);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const result = await productService.getProductById(+id);
  return res.status(200).json(result);
};

const registerProduct = async (req, res) => {
  const productData = req.body;
  const result = await productService.registerProduct(productData);
  return res.status(201).json(result);
};

module.exports = {
  getAllProducts,
  getProductById,
  registerProduct,
};
