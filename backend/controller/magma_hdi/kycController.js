const KycModel = require('../../models/magma_hdi/kycSchema');

const submitKyc = async (req, res) => {
    try {
        const kycData = new KycModel(req.body);
        const savedData = await kycData.save();
        res.status(201).json({
            success: true,
            message: 'KYC data submitted successfully',
            data: savedData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting KYC data',
            error: error.message
        });
    }
};

module.exports = { submitKyc };