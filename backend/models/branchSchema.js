import Mongoose from "mongoose";
import AddBranch from "./addbranchSchema.js";
const BranchSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      ref: AddBranch,
      required: true,
    },

    branchemail: {
      type: String,
      ref: AddBranch,
      required: true,
    },

    password: {
      type: String,
      ref: AddBranch,
      required: true,
    },
    confirm_password: {
      type: String,
      ref: AddBranch,
      required: true,
    },
  },
  { timestamps: true }
);

const Branches = Mongoose.model("Branch", BranchSchema);
export default Branches;
