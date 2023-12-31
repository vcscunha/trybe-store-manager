const { produtoSchema, vendaSchema, quantidadeSchema } = require('./schema');

const produtoModel = require('../../models/produtoModel');
const saleModel = require('../../models/vendaModel');

const validarProduto = (produto) => {
  const { error } = produtoSchema.validate(produto);

  if (error) {
    if (error.message === '"name" is required') {
      return { type: 'VALUE_IS_REQUIRED', message: '"name" is required' };
    }
    if (error.message === '"name" length must be at least 5 characters long') {
      return { type: 'SMALL_VALUE', message: '"name" length must be at least 5 characters long' };
    }
  }

  return { type: null, message: '' };
};

const validarVenda = (venda) => {
  const { error } = vendaSchema.validate(venda);

  if (error) {
    if (error.message.includes('is required')) {
      return { type: 'VALUE_IS_REQUIRED', message: error.message };
    }
    if (error.message.includes('must be greater than or equal to 1')) {
      return { type: 'SMALL_VALUE', message: error.message };
    }
  }

  return { type: null, message: '' };
};

const validarQuantidade = (quantidade) => {
  const { error } = quantidadeSchema.validate(quantidade);

  if (error) {
    if (error.message.includes('is required')) {
      return { type: 'VALUE_IS_REQUIRED', message: error.message };
    }
    if (error.message.includes('must be greater than or equal to 1')) {
      return { type: 'SMALL_VALUE', message: error.message };
    }
  }

  return { type: null, message: '' };
};

const validarProductIdsVenda = async (venda) => {
  const productIdsVenda = venda
    .map(({ productId }) => productId);

  const produtosDatabase = await produtoModel.obterProdutos();

  const productIdsDatabase = produtosDatabase
    .map(({ id }) => id);

  const productIdsExistem = productIdsVenda
    .every((productIdVenda) => productIdsDatabase.includes(productIdVenda));

  if (!productIdsExistem) return { type: 'NOT_FOUND', message: 'Product not found' };

  return { type: null, message: '' };
};

const validarProductIdExiste = async (idProduto) => {
  const produto = await produtoModel.obterProdutoPorId(idProduto);

  if (!produto) return { type: 'NOT_FOUND', message: 'Product not found' };

  return { type: null, message: '' };
};

const validarSaleIdExiste = async (idVenda) => {
  const venda = await saleModel.obterVendaPorId(idVenda);

  if (!venda || venda.length === 0) return { type: 'NOT_FOUND', message: 'Sale not found' };

  return { type: null, message: '' };
};

module.exports = {
  validarProduto,
  validarVenda,
  validarQuantidade,
  validarProductIdsVenda,
  validarProductIdExiste,
  validarSaleIdExiste,
};
