import Mongoose from "mongoose";

const CompanyTypeSchema = new Mongoose.Schema(
  {
    c_type: {
      type: String,
      required: true,
    },
    category: {
      type: [String], // Array of segment names
      default: [],
    },
    segment: {
      type: [String], // Array of segment names
      default: [],
    }
      
  },
  { timestamps: true }
);

const CType = Mongoose.model("CompanyType", CompanyTypeSchema);
export default CType;
