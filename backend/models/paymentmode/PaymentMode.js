import Mongoose from "mongoose";
const paymentSchema = new Mongoose.Schema(
  {
    paymentmode: {
      type: String,
      required: true,
    },  
  },
  { timestamps: true }
);

const PaymentMode= Mongoose.model("PaymentMode", paymentSchema);
export default PaymentMode;
