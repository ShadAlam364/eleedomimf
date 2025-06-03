import Mongoose from "mongoose";
const AddPolicySchema = new Mongoose.Schema(
  {
    addpolicytype: {
        type: String,
        ref: "AddEmployee",
        required: true,
    },
    addpolicytitle: {
      type: String,
      required: true,
    },
    addpolicydesc: {
      type: String,
    //   required: true,
    },
    addpolicyimage: {
        type: String,
        required: true,
      },
      addpolicycname: {
        type: String,
        required: true,
      },
      addpolicylogo: {
        type: String,
        // unique: true,

      },
     
  },
  { timestamps: true }
);

const AddPolicy = Mongoose.model("AddPolicy", AddPolicySchema);
export default AddPolicy;
