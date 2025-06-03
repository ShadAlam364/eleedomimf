import Mongoose from "mongoose";
const UserClaimSchema = new Mongoose.Schema(
  {
    userclaim_name: {
      type: String,
      required: true,
    },
    userclaim_email: {
      type: String,
      required: true,
    },
    userclaim_mobile: {
      type: Number,
      required: true,
    },
    userclaim_insurance_name: {
      type: String,
      required: true,
    },
    userclaim_policyno: {
      type: Number,
      required: true,
    },

    userclaim_date: {
      type: String,
      required: true,
    },

    userclaim_time: {
      type: String,
      required: true,
    },

    userclaim_policyexp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserClaim = Mongoose.model("UserClaim", UserClaimSchema);
export default UserClaim;
