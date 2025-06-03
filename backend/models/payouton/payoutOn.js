import Mongoose from "mongoose";
const payoutOnSchema = new Mongoose.Schema(
  {
    payouton: {
      type: String,
      required: true,
    },  
  },
  { timestamps: true }
);

const payoutOn= Mongoose.model("payoutOn", payoutOnSchema);
export default payoutOn;
