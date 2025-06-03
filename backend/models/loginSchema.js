import Mongoose from "mongoose";
const AdminSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password:{
      type: String,
      
    },
    gender: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
    //   required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const AdminLogin = Mongoose.model("Admin", AdminSchema);
export default AdminLogin;
