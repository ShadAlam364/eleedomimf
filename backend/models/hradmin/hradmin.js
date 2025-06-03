import Mongoose from "mongoose";
const AddHrAdminSchema = new Mongoose.Schema(
  {
    hradname: {
      type: String,
    //   required: true,
    },
    hradpassword: {
      type: String,
      required: true,
    },
    confirmehrad_password: {
      type: String,
    },
    hraddob: {
      type: String,
    //   required: true,
    },
    hradgender: {
      type: String,
    //   required: true,
    },
    hrademail: {
      unique: true,
      type: String,
       required: true,
    },
    hradmobile: {
      type: Number,
    //   required: true,
    },
    hradjoiningdate: {
      type: String,
    //   required:true,
    },
    hradbranch: {
      type: String,
    //   required: true,
    },
    permanenthradaddress: {
      type: String,
    //   required: true,
    },
    currenthradaddress: {
      type: String,
    //   required: true,
    },
    hradaadharno: {
      type: Number,
    //   required: true,
    },

    hradaccNumber: {
      type: Number,
    //   required: true,
    },
    hradbankName: {
      type: String,
    //   required: true,
    },
    hradifsc: {
      type: String,
      
    },
    hradpan: {
      type: String,
    //   required: true,
    },
    hradpanno: {
      type: String,
    },
    hradaadharfile: {
      type: String,
    //   unique: true,
    },
    isHr: {
      type: Boolean,
     default: false,
    },
   
  },
  { timestamps: true }
);

const HrAdmin = Mongoose.model("HrAdmin", AddHrAdminSchema);
export default HrAdmin;
