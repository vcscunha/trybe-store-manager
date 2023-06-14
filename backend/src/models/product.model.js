const connection = require('./connection');

const getAllProducts = async () => {
  const [result] = await connection.execute(
    'SELECT * FROM products',
  );

  return result;
};

const getProductById = async (productId) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM products WHERE id = ?',
    [productId],
  );

  return result;
};

const registerProduct = async (productData) => {
  const { name } = productData;
  
  const [{ insertId }] = await connection.execute(
    'INSERT INTO products (name) VALUES (?)',
    [name],
  );

  return insertId;
};

const updateProduct = async (productId, productData) => {
  const { name } = productData;
  
  await connection.execute(
    'UPDATE products SET name = (?) WHERE id = (?)',
    [name, productId],
  );
};

const deleteProduct = async (productId) => {
  await connection.execute(
    'DELETE FROM products WHERE id = ?',
    [productId],
  );
};

module.exports = {
  getAllProducts,
  getProductById,
  registerProduct,
  updateProduct,
  deleteProduct,
};
