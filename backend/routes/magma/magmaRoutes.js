const express = require('express');
const router = express.Router();
const { submitKyc } = require('../../controller/magma_hdi/kycController');

// KYC form submission route
router.post('/kyc', submitKyc);

// ...existing code...

module.exports = router;