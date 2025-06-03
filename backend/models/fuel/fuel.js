import Mongoose from "mongoose";
const fuelSchema = new Mongoose.Schema(
  {
    fuels: {
      type: String,
      required: true,
    },  
  },
  { timestamps: true }
);

const Fuel = Mongoose.model("Fuel", fuelSchema);
export default Fuel;
