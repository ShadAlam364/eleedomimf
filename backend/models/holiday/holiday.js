import Mongoose from "mongoose";

const HolidaySchema = new Mongoose.Schema(
  {
    hdate: {
      type: String,
      required: true,
    },
    hdays: {
      type: [String], // Array of list of holiday names
      default: [],
    },
   
      
  },
  { timestamps: true }
);

const Holidays = Mongoose.model("Holidays", HolidaySchema);
export default Holidays;
