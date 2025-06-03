import Mongoose from "mongoose";
const UserComplaintSchema = new Mongoose.Schema(
  {
    complaint_name: {
      type: String,
      required: true,
    },
    complaint_email: {
      type: String,
      required: true,
    },
    complaint_mobile: {
      type: Number,
      required: true,
    },
    complaint_subject: {
      type: String,
      required: true,
    },

    complaint_query: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserComplaint = Mongoose.model("UserComplaint", UserComplaintSchema);
export default UserComplaint;
