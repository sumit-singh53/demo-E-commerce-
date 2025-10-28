// POST, GET, DELETE /api/cart
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateCartInput } = require('../middlewares/validateInput');

router.get('/', cartController.getCart);
router.post('/add', validateCartInput, cartController.addToCart);
router.post('/remove', validateCartInput, cartController.removeFromCart);

module.exports = router;
