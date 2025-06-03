import Mongoose from "mongoose";
const staffTypeSchema = new Mongoose.Schema(
  {
    s_type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StaffType = Mongoose.model("StaffType", staffTypeSchema);
export default StaffType;
