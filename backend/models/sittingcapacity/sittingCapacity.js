import Mongoose from "mongoose";
const sitCapacitySchema = new Mongoose.Schema(
  {
    sitcapacity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SittingCapacity = Mongoose.model("SittingCapacity", sitCapacitySchema);
export default SittingCapacity;
