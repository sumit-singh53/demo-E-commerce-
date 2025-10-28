// POST /api/checkout
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { validateCheckoutInput } = require('../middlewares/validateInput');

router.post('/', validateCheckoutInput, checkoutController.checkout);

module.exports = router;