import Mongoose from "mongoose";
const ncbSchema = new Mongoose.Schema(
  {
    ncb: {
      type: String,
       required: true,
    },
  },
  { timestamps: true }
);

const ncbAdd = Mongoose.model("ncbAdd", ncbSchema);
export default ncbAdd;
