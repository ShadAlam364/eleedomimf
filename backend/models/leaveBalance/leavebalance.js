import Mongoose from "mongoose";

const LeaveBalanceSchema = new Mongoose.Schema(
  {
    leavetype: {
      type: String,
      required: true,
    },
    restleave: {
      type: Number, // Array of segment names
    }, 
  },
  { timestamps: true }
);

const LBalance = Mongoose.model("LBalance", LeaveBalanceSchema);
export default LBalance;
