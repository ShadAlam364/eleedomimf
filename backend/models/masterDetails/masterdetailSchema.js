import mongoose from "mongoose";

const AllInsurancePolicySchema = new mongoose.Schema(
  {
    policyrefno: {
      type: String,
    },
    entryDate: {
      type: String,
    },
    states: {
      type: String,
    },
    district: {
      type: String,
    },
    company: {
      type: String,
    },
    category: {
      type: String,
    },
    segment: {
      type: String,
    },
    sourcing: {
      type: String,
    },
    policyNo: {
      type: String,
    },
    insuredName: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    vehRegNo: {
      type: String,
    },
    policyStartDate: {
      type: String,
    },
    policyEndDate: {
      type: String,
    },
    odExpiry: {
      type: String,
    },
    tpExpiry: {
      type: String,
    },
    idv: {
      type: Number,
    },
    bodyType: {
      type: String,
    },
    makeModel: {
      type: String,
    },
    mfgYear: {
      type: Number,
    },
    registrationDate: {
      type: String,
    },
    vehicleAge: {
      type: String,
    },
    fuel: {
      type: String,
    },
    gvw: {
      type: Number,
    },
    cc: {
      type: String,
    },
    engNo: {
      type: String,
    },
    chsNo: {
      type: String,
    },
    rsa: {
      type: String,
    },
    policyType: {
      type: String,
    },
    productCode: {
      type: String,
    },
    advId: {
      type: String,
    },
    odPremium: {
      type: Number,
    },
    liabilityPremium: {
      type: Number,
    },
    netPremium: {
      type: Number,
    },
    finalEntryFields: {
      type: Number,
      default: 0,
    },
    odDiscount: {
      type: Number,
    },
    ncb: {
      type: String,
      default: "",
    },
    advisorName: {
      type: String,
    },
    subAdvisor: {
      type: String,
    },
    policyMadeBy: {
      type: String,
    },
    branch: {
      type: String,
    },
    payoutOn: {
      type: String,
    },
    sitcapacity: {
      type: String,
    },
    taxes: {
      type: Number,
    },
    policyPaymentMode: {
      type: String,
    },
    paymentDoneBy: {
      type: String,
    },
    chqNoRefNo: {
      type: String,
    },
    bankName: {
      type: String,
    },
    chqPaymentDate: {
      type: String,
    },
    chqStatus: {
      type: String,
    },
    advisorPayableAmount: {
      type: Number,
      default: 0,
    },
    advisorPayoutAmount: {
      type: Number,
      default: 0,
    },
    branchPayout: {
      type: Number,
      default: 0,
    },
    branchPayableAmount: {
      type: Number,
      default: 0,
    },
    companyPayout: {
      type: Number,
      default: 0,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
    hypo: {
      type: String,
    },
    staffName: {
      type: String,
    },
    staffType: {
      type: String,
    },
    employee_id: {
      type: String,
    },
    currentTime: {
      type: String,
    },
    empTime: {
      type: String,
    },
    cvpercentage: {
      type: Number,
      default: 0,
    },
    branchpayoutper: {
      type: Number,
      default: 0,
    },
    companypayoutper: {
      type: Number,
      default: 0,
    },
    debitAmount: {
      type: Number,
    },
    debitMonthlyAmount: {
      type: Number,
    },
    debitCompanyAmount: {
      type: Number,
    },
    paymentDate: {
      type: String,
    },
    paymentMonthlyDate: {
      type: String,
    },
    paymentCompanyDate: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    paymentMonthlyType: {
      type: String,
    },
    paymentCompanyType: {
      type: String,
    },
    paymentRefNo: {
      type: String,
    },
    paymentMonthlyRefNo: {
      type: String,
    },
    paymentCompanyRefNo: {
      type: String,
    },
    creditAmount: {
      type: Number,
    },
    creditMonthlyAmount: {
      type: Number,
    },
    creditCompanyAmount: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    balanceMonthly: {
      type: Number,
    },
    balanceCompany: {
      type: Number,
    },
    overallTime: {
      type: String,
    },
    inspectionBy: {
      type: String,
    },
    inspectionID: {
      type: String,
    },
    inspectionDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Renewed","Pending", "Renewable", "Loss to Competitor", "Vehicle Sold", "Active"],
      default: "Renewable",
    },
  },
  { timestamps: true }
);

const AllInsurance = mongoose.model("AllInsurance", AllInsurancePolicySchema);

export default AllInsurance;











// import mongoose from "mongoose";

// const AllInsurancePolicySchema = new mongoose.Schema(
//   {
//     policyrefno: {
//       type: String,
//     },
//     entryDate: {
//       type: String,
//     },
//     states: {
//       type: String,
//     },
//     district: {
//       type: String,
//     },
//     company: {
//       type: String,
//     },
//     category: {
//       type: String,
//     },
//     segment: {
//       type: String,
//     },
//     sourcing: {
//       type: String,
//     },
//     policyNo: {
//       type: String,
//     },
//     insuredName: {
//       type: String,
//     },
//     contactNo: {
//       type: String,
//     },
//     vehRegNo: {
//       type: String,
//     },
//     policyStartDate: {
//       type: String,
//     },
//     policyEndDate: {
//       type: String,
//     },
//     odExpiry: {
//       type: String,
//     },
//     tpExpiry: {
//       type: String,
//     },
//     idv: {
//       type: Number,
//     },
//     bodyType: {
//       type: String,
//     },
//     makeModel: {
//       type: String,
//     },
//     mfgYear: {
//       type: Number,
//     },
//     registrationDate: {
//       type: String,
//     },
//     vehicleAge: {
//       type: String,
//     },
//     fuel: {
//       type: String,
//     },
//     gvw: {
//       type: Number,
//     },
//     cc: {
//       type: String,
//     },
//     engNo: {
//       type: String,
//     },
//     chsNo: {
//       type: String,
//     },
//     rsa: {
//       type: String,
//     },
//     policyType: {
//       type: String,
//     },
//     productCode: {
//       type: String,
//     },
//     advId: {
//       type: String,
//     },
//     odPremium: {
//       type: Number,
//     },
//     liabilityPremium: {
//       type: Number,
//     },
//     netPremium: {
//       type: Number,
//     },
//     finalEntryFields: {
//       type: Number,
//       default: 0
//     },
//     odDiscount: {
//       type: Number,
//     },
//     ncb: {
//       type: String,
//       default: ""
//     },
//     advisorName: {
//       type: String,
//     },
//     subAdvisor: {
//       type: String,
//     },
//     policyMadeBy: {
//       type: String,
//     },
//     branch: {
//       type: String,
//     },
//     payoutOn: {
//       type: String,
//     },
//     sitcapacity: {
//       type: String,
//     },
//     taxes: {
//       type: Number,
//     },
//     policyPaymentMode: {
//       type: String,
//     },
//     paymentDoneBy: {
//       type: String,
//     },
//     chqNoRefNo: {
//       type: String,
//     },
//     bankName: {
//       type: String,
//     },
//     chqPaymentDate: {
//       type: String,
//     },
//     chqStatus: {
//       type: String,
//     },
//     advisorPayableAmount: {
//       type: Number,
//       default: 0,
//     },
//     advisorPayoutAmount: {
//       type: Number,
//       default: 0,
//     },
//     branchPayout: {
//       type: Number,
//       default: 0,
//     },
//     branchPayableAmount: {
//       type: Number,
//       default: 0,
//     },
//     companyPayout: {
//       type: Number,
//       default: 0,
//     },
//     profitLoss: {
//       type: Number,
//       default: 0,
//     },
//     hypo: {
//       type: String,
//     },
//     staffName: {
//       type: String,
//     },
//     staffType: {
//       type: String,
//     },
//     employee_id: {
//       type: String,
//     },
//     currentTime: {
//       type: String,
//     },
//     empTime: {
//       type: String,
//     },
//     cvpercentage:{
//       type: Number,
//       default: 0,
//     },
//     branchpayoutper:{
//       type: Number,
//       default: 0,
//     },
//     companypayoutper:{
//       type: Number,
//       default: 0,
//     },

//     debitAmount: {
//       type: Number,
//       // required: true,
//     },
//     debitMonthlyAmount: {
//       type: Number,
//       // required: true,
//     },
//     debitCompanyAmount: {
//       type: Number,
//       // required: true,
//     },

//     paymentDate: {
//       type: String,
//     },
//     paymentMonthlyDate: {
//       type: String,
//     },
//     paymentCompanyDate: {
//       type: String,
//     },
//     paymentType: {
//       type: String,
//     },
//     paymentMonthlyType: {
//       type: String,
//     },
//     paymentCompanyType: {
//       type: String,
//     },
//     paymentRefNo: {
//       type: String,
//     },
//     paymentMonthlyRefNo:{
//       type: String,
//     },
//     paymentCompanyRefNo:{
//       type: String,
//     },
//     creditAmount: {
//       type: Number,
//     },
//     creditMonthlyAmount: {
//       type: Number,
//     },
//     creditCompanyAmount: {
//       type: Number,
//     },
//     balance: {
//       type: Number,
//     },
//     balanceMonthly: {
//       type: Number,
//     },
//     balanceCompany: {
//       type: Number,
//     },
//     overallTime: {
//       type: String,
//     },
//     inspectionBy:{
//       type:String,
//     },
//     inspectionID: {
//       type:String
//     },
//     inspectionDate: {
//       type: String,
//     },
//     status: {
//       type: String,
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// );

// const AllInsurance = mongoose.model("AllInsurance", AllInsurancePolicySchema);

// export default AllInsurance;

const counterSchema = new mongoose.Schema({
  policyrefno: {
    type: String,
  },
  seq: {
    type: Number,
  },
});
export const Counter = mongoose.model("Counter", counterSchema);
