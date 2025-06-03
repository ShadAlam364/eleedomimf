import Mongoose from "mongoose";
const OpsSchema = new Mongoose.Schema(
  {
    opsid: {
      type: String,
    //   required: true,
    },
    opsname: {
      type: String,
       required: true,
    },
    opspassword: {
      type: String,
      required: true,
    },
    confirm_opspassword: {
      type: String,
    },
    opsdob: {
      type: String,
    //   required: true,
    },
    opsgender: {
      type: String,
    //   required: true,
    },
    opsemail: {
      type: String,
      required: true,
    },
    opsmobile: {
      type: Number,
    //   required: true,
    },
    opsjoiningdate: {
      type: String,
    //   required: true,
    },
    permanentopsaddress: {
      type: String,
    //   required: true,
    },
    currentopsaddress: {
      type: String,
    //   required: true,
    },
    isOps: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const OpsAdmin = Mongoose.model("OpsAdmin", OpsSchema);
export default OpsAdmin;
