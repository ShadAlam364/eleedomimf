import Mongoose from "mongoose";
const UserFeedbackSchema = new Mongoose.Schema(
  {
    feedbackuser_name: {
      type: String,
      required: true,
    },
    feedbackuser_email: {
      type: String,
      required: true,
    },
    feedbackuser_mobile: {
      type: Number,
      required: true,
    },
    feedbackuser_query: {
        type: String,
        required: true,
      },
      feedbackuser_upload: {
      type: String,
    },
    feedbackuser_status:{
      type: Boolean,
      default:false,
      required:true
    }
  },
  { timestamps: true }
);

const UserFeedback = Mongoose.model("UserFeedback", UserFeedbackSchema);
export default UserFeedback;
