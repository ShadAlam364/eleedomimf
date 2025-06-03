import Mongoose from "mongoose";
const HRSalarySchema = new Mongoose.Schema(
  {
    hrname: {
        type: String,
        ref: "AddHr",
        required: true,
    },
    hrmonthlySalary: {
        type: Number,
        default: 0
        
      },
      hrmonthlyLeave: {
        type: Number,
        default: 0
      },
  },
  { timestamps: true }
);

const HRSalary = Mongoose.model("HRSalary", HRSalarySchema);
export default HRSalary;
