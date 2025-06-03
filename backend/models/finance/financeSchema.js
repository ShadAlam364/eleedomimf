import Mongoose from "mongoose";
const financeSchema = new Mongoose.Schema(
  {
    finname: {
      type: String,
      required: true,
    },
    finemail: {
      type: String,
      unique: true,
      required: true,
    },
    finmobile: {
      type: String,
      unique: true,
      required: true,
    },
    finpassword: {
      type: String,
      required: true,
    },
    finconfirm_password:{
      type: String,
      
    },
    fingender: {
      type: String,
    },
isFinance: {
      type: Boolean,
      default: false,
    },
   
  },
  { timestamps: true }
);

const FinanceLogin = Mongoose.model("Finance", financeSchema);
export default FinanceLogin;
