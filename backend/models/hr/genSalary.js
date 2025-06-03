import Mongoose from "mongoose";
const GenHRSchema = new Mongoose.Schema(
  {
    hrname: {
      type: String,
      ref: "HRSalary",
      required: true,
    },
    hrmonthlySalary: {
      type: Number,
      ref: "HRSalary",
      required: true,
    },
    hrmonthlyLeave: {
      type: Number,
      ref: "HRSalary",
      default: 0,
      required: true,
    },

    genHrMonths: {
      type: String,
      required: true,
    },
    totalhrDays: {
        type: String,
        required: true,
      },
    presenthrDays: {
      type: Number,
      required: true,
    },
    totalhrHalfDays: {
      type: Number,
      required: true,
    },
    totalhrAbsent: {
      type: Number,
      required: true,
    },
    genhrSalary: {
      type: Number,
      required: true,
    },
    hrincentive: {
      type: Number,
      required: true,
    },
    totalhrAmount: {
      type: Number,
      required: true,
    },
    grossSalary: {
        type: Number,
        required: true,
      },
      basicSalary: {
        type: Number,
        required: true,
      },
      hra: {
        type: Number,
        required: true,
      },
      ca: {
        type: Number,
        required: true,
      },
      medical: {
        type: Number,
        required: true,
      },
      tiffin: {
        type: Number,
        required: true,
      },

      companyPf: {
        type: Number,
        required: true,
      },
      pf: {
        type: Number,
        required: true,
      },
      esi: {
        type: Number,
        required: true,
      },
      loanemi: {
        type: Number,
        required: true,
      },
  },
  { timestamps: true }
);

const GenHRSalary = Mongoose.model("GenHRSalary", GenHRSchema);
export default GenHRSalary;
