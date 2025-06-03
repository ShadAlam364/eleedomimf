const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    panCard: { type: String, required: true },
    aadharCard: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const KycModel = mongoose.model('KYC', kycSchema);
module.exports = KycModel;