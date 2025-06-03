import Mongoose from "mongoose";

// Leave Balance Schema
const leaveBalanceSchema = new Mongoose.Schema(
  {
    restLeave: {
      type: String,
      required: true,
      enum: ["CL", "SL", "PL", "EL"],
    },
    num: {
      type: Number,
      required: true,
    },
  },

); // Disabling _id for subdocuments

// Default Leave Balances
const defaultLeaveBalances = [
  { restLeave: "CL", num: 6 },
  { restLeave: "SL", num: 4 },
  { restLeave: "PL", num: 2 },
  { restLeave: "EL", num: 0 },
];

const AddEmployeeSchema = new Mongoose.Schema(
  {
    empid: {
      type: String,
      // required: true,
    },
    uniqueid: {
      type: String,
    },
    flags: {
      type: Boolean,
      default:true,
      required: true
    },
    empname: {
      type: String,
      // required: true,
    },
    emppassword: {
      type: String,
      // required: true,
    },
    confirmemp_password: {
      type: String,
    },
    empdob: {
      type: String,
      // required: true,
    },
    empgender: {
      type: String,
      // required: true,
    },
    empemail: {
      unique: true,
      type: String,
      // required: true,
    },
    empmobile: {
      type: Number,
      // required: true,
    },
    empjoiningdate: {
      type: String,
      // required:true,
    },
    empbranch: {
      type: String,
      // required: true,
    },
    permanentempaddress: {
      type: String,
      // required: true,
    },
    currentempaddress: {
      type: String,
      // required: true,
    },
    empaadharno: {
      type: Number,
      default: 0
      // required: true,
    },

    accNumber: {
      type: Number,
      // required: true,
    },
    bankName: {
      type: String,
      // required: true,
    },
    ifsc: {
      type: String,
    },
    pan: {
      type: String,
      // required: true,
    },
    panno: {
      type: String,
    },
    empaadharfile: {
      type: String,
      unique: true, // Ensure uniqueness
      sparse: true, // Allow multiple documents to have a null value
      default: "NA",
    },
    staffType: {
      type: String,
      ref: "StaffType",
      // required: true,
    },
    empdesignation: {
      type: String,
      // required: true,
    },
    salary: {
      type: Number,
      // required: true,
    },
    incdate: {
      type: String,
    },
    incmoney: {
      type: Number,
      default: 0,
    },
    currDate: {
      type: String,
    },
    leavebalance: {
      type: [leaveBalanceSchema],
      default: defaultLeaveBalances,
    },
    leaveDetails: [
      {
        dateRange: {
          startDate: String,

          endDate: { type: String, default: "" },
        },
        reasonForLeave: String,
        status: String,
        counts: Number,
        leavetype: String,
        restleave: Number,
        remarks: String,
        applyDate: String,
        applytime: String,
      },
    ],
    terminatedate: {
      type: String,
    },
    leavemonth: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

const AddEmployee = Mongoose.model("AddEmployee", AddEmployeeSchema);
export default AddEmployee;
