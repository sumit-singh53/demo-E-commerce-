// POST, GET, DELETE /api/cart
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateAddToCartInput, validateRemoveFromCartInput } = require('../middlewares/validateInput');

router.get('/', cartController.getCart);
router.post('/add', validateAddToCartInput, cartController.addToCart);
router.post('/remove', validateRemoveFromCartInput, cartController.removeFromCart);

module.exports = router;
