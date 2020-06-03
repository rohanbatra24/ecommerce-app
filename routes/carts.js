const express = require('express');

const cartsRepo = require('../repositories/carts');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
	//figure out the cart

	let cart;

	if (!req.session.cartId) {
		// we dont have a cart, we need to create one
		// store the cart id on the req.session.cartId
		// property

		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	}
	else {
		// we have a cart, lets get it from the carts repo
		cart = await cartsRepo.getOne(req.session.cartId);
	}

	console.log(cart);

	res.send('product added to cart');
});

module.exports = router;
