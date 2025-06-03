import Mongoose from "mongoose";
const companyFormSchema = new Mongoose.Schema(
  {
    h_name: {
      type: String,
      required: true,
    },
    h_email: {
      type: String,
      required: true,
    },
    h_mobile: {
      type: Number,
      required: true,
    },
    h_cname: {
      type: String,
      required: true,
    },
    h_address: {
      type: String,
    },
  },
  { timestamps: true }
);

const CompanyFilled = Mongoose.model("CompanyFilled", companyFormSchema);
export default CompanyFilled;
