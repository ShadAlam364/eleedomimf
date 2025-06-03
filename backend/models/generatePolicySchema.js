import Mongoose from "mongoose";
const GenPolicySchema = new Mongoose.Schema(
  {
    empName: {
        type: String,
        ref: "AddSalary",
        required: true,
    },
    monthsalary: {
      type: Number,
      ref: "AddSalary",
      required: true,
    },
    monthleave: {
      type: Number,
      ref: "AddSalary",
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Genpolicy = Mongoose.model("Genpolicy", GenPolicySchema);
export default Genpolicy;
