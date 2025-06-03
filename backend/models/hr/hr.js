import Mongoose from "mongoose";
const AddHRSchema = new Mongoose.Schema(
  {
    hrid: {
      type: String,
      required: true,
    },

    hrname: {
      type: String,
      required: true,
    },
    hrpassword: {
      type: String,
      required: true,
    },
    hrdob: {
      type: String,
      required: true,
    },
    hrgender: {
      type: String,
      required: true,
    },
    hremail: {
      unique: true,
      type: String,
      required: true,
    },
    hrmobile: {
      type: Number,
      required: true,
    },
    hrjoiningdate: {
      type: String,
      required: true,
    },
    hrbranch: {
      type: String,
      required: true,
    },
    permanenthraddress: {
      type: String,
      required: true,
    },
    currenthraddress: {
      type: String,
      required: true,
    },
    hraadharno: {
      type: Number,
      required: true,
    },
    hraadharfile: {
      type: String,
      unique: true,
    },

    hrdesignation: {
      type: String,
      required: true,
    },
    isHr: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AddHr = Mongoose.model("AddHr", AddHRSchema);
export default AddHr;
