const express = require('express');

const productsIndexTemplate = require('../views/products/index');

const productsRepo = require('../repositories/products');

const router = express.Router();

router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemplate({ products }));
});

module.exports = router;
