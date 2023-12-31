const connection = require('./connection');

const obterVendas = async () => {
  const [vendas] = await connection.execute(
    `SELECT
      s.id AS saleId,
      s.date,
      sp.product_id AS productId,
      sp.quantity
    FROM sales AS s
    INNER JOIN sales_products AS sp
      ON s.id = sp.sale_id
    ORDER BY saleId, productId`,
  );

  return vendas;
};

const obterVendaPorId = async (idVenda) => {
  const [venda] = await connection.execute(
    `SELECT
      s.date,
      sp.product_id AS productId,
      sp.quantity
    FROM sales AS s
    INNER JOIN sales_products AS sp
      ON s.id = sp.sale_id
    WHERE s.id = ?
    ORDER BY sale_id, productId`,
    [idVenda],
  );

  return venda; 
};

const cadastrarVenda = async (dadosVenda) => {
  const [{ insertId }] = await connection.execute(
    'INSERT INTO sales (date) VALUE (NOW())',
  );
  
  const itens = dadosVenda.map(({ productId, quantity }) => connection.execute(
    'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
    [insertId, productId, quantity],
  ));

  await Promise.all(itens);

  return insertId;
};

const atualizarVenda = async (idVenda, idProduto, dadosAlterar) => {
  const { quantity } = dadosAlterar;
  
  await connection.execute(
    'UPDATE sales_products SET quantity = ? WHERE sale_id = ? AND product_id = ?',
    [quantity, idVenda, idProduto],
  );

  const [[{ date }]] = await connection.execute(
    'SELECT * FROM sales WHERE id = ?',
    [idVenda],
  );

  return date;
};

const deletarVenda = async (idVenda) => {
  await connection.execute(
    'DELETE FROM sales WHERE id = ?',
    [idVenda],
  );

  await connection.execute(
    'DELETE FROM sales_products WHERE sale_id = ?',
    [idVenda],
  );
};

module.exports = {
  obterVendas,
  obterVendaPorId,
  cadastrarVenda,
  atualizarVenda,
  deletarVenda,
};
