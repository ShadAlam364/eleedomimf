import Mongoose from "mongoose";
const PolicyTypeSchema = new Mongoose.Schema(
  {
    p_type: {
      type: String,
      required: true,
    },
    products: {
      type: [String], // Array of product names
      default: [],    // Default to an empty array
    },
  },
  { timestamps: true }
);

const PolicyStaffType = Mongoose.model("PolicyType", PolicyTypeSchema);
export default PolicyStaffType;
