import Mongoose from "mongoose";
const cicSchema = new Mongoose.Schema(
  {
    cicid: {
      type: String,
    //   required: true,
    },
    cicname: {
      type: String,
       required: true,
    },
    cicpassword: {
      type: String,
      required: true,
    },
    confirm_cicpassword: {
      type: String,
    },
    cicdob: {
      type: String,
    //   required: true,
    },
    cicgender: {
      type: String,
    //   required: true,
    },
    cicemail: {
      type: String,
      required: true,
    },
    cicmobile: {
      type: Number,
    //   required: true,
    },
    cicjoiningdate: {
      type: String,
    //   required: true,
    },
    permanentcicaddress: {
      type: String,
    //   required: true,
    },
    currentcicaddress: {
      type: String,
    //   required: true,
    },
    isCic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const cicAdmin = Mongoose.model("cicAdmin", cicSchema);
export default cicAdmin;
