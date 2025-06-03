import Mongoose from "mongoose";
const AddCompanySchema = new Mongoose.Schema(
  {
    comp_insurance: {
      type: String,
      required: true,
    },
    comp_categories: {
      type: String,
      required:true,
      
    },
    comp_establishment: {
      type: String,
    },
    comp_cname: {
      type: String,
      required: true,
    },
    comp_cfiles: {
      type: String,
      // required:true,
    },
   
   
  },
  { timestamps: true }
);

const AddCompanies = Mongoose.model("AddCompanies", AddCompanySchema);
export default AddCompanies;