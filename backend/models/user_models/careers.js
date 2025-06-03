import Mongoose from "mongoose";
const careerSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    qualification: {
      type: String,
      required: true,
    },
    applyDate: {
      type: String,
    },
    level: {
      type: String,
      required: true,
    },
    position: {
      type: String,
    },
    pdfs: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Career = Mongoose.model("Career", careerSchema);
export default Career;
