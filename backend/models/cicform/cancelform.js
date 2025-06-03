import mongoose from "mongoose";
const { Schema } = mongoose;

const cancelSchema = new Schema({
  sNo: { type: Number, unique: true },
  date: { type: String },
  policyNo: { type: String },
  policyIssueDate: { type: String },
  insuredName: { type: String },
  regNo: { type: String },
  company: { type: String },
  reason: { type: String },
  advisor: { type: String },
  branch: { type: String },
  policyAmount: { type: Number },
  status: { type: String },
  refundAmount: { type: Number },
  refundDate: { type: String },
  utrNeftNo: { type: String },
  bankName: { type: String },
  paidThrough: { type: String }
});

// Pre-save hook to auto increment sNo
cancelSchema.pre('save', async function (next) {
    if (this.isNew) {
      const latestClaim = await mongoose.model('CancelForm').findOne().sort({ sNo: -1 });
      this.sNo = latestClaim ? latestClaim.sNo + 1 : 1;
    }
    next();
  });

const CancelForm = mongoose.model('CancelForm', cancelSchema);

export default CancelForm;
