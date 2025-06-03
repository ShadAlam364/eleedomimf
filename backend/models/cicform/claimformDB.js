import mongoose from "mongoose";
const { Schema } = mongoose;

const claimedSchema = new Schema({
  sNo: { type: Number, unique: true },
  date: { type: String },
  companyName: { type: String},
  claimType: { type: String },
  policyNo: { type: String },
  insuredName: { type: String },
  contactNo: { type: Number},
  vehicleRegNo: { type: String },
  vehicleType: { type: String },
  policyExpiryDate: { type: String },
  intimationDate: { type: String},
  claimNo: { type: String},
  advisor:{ type: String},
  branch: { type: String },
  claimStatus: { type: String},
  claimAmount: { type: Number },
  surveyorName: { type: String },
  surveyorContactNo: { type: Number},
  remarks: { type: String },
});

// Pre-save hook to auto increment sNo
claimedSchema.pre('save', async function (next) {
    if (this.isNew) {
      const latestClaim = await mongoose.model('ClaimFormDB').findOne().sort({ sNo: -1 });
      this.sNo = latestClaim ? latestClaim.sNo + 1 : 1;
    }
    next();
  });

const ClaimFormDB = mongoose.model("ClaimFormDB", claimedSchema);

export default ClaimFormDB;
