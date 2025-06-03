import mongoose from 'mongoose';

const { Schema } = mongoose;

const indorshmentSchema = new Schema({
  sNo: { type: Number, unique: true },
  date: { type: String },
  companyName: { type: String},
  policyNo: { type: String},
  insuredName: { type: String},
  regNo: { type: String },
  typeOfIndo: { type: String },
  subTypeIndo: { type: String },
  policyMadeBy: { type: String },
  mistakeOf: { type: String },
  reason: { type: String },
  advisorName: { type: String },
  branch: { type: String },
  status: { type: String },
  policyStatus: { type: String },
  chequeNo: { type: String },
  finalStatus: { type: String },
  remarks: { type: String },
});

indorshmentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const latestClaim = await mongoose.model('indorshmentForm').findOne().sort({ sNo: -1 });
    this.sNo = latestClaim ? latestClaim.sNo + 1 : 1;
  }
  next();
});

const indorshmentForm = mongoose.model("indorshmentForm", indorshmentSchema);

export default indorshmentForm;


// Pre-save hook to auto increment sNo


