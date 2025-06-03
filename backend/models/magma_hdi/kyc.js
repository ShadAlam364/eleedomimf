import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    ckycNumber: {
      type: String,
    },
    documentType: {
      type: String,
      enum: ["AADHAAR", "CKYC"],
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending"
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed
    },
    documentUrl: {
      type: String
    },
    businessSourceType: {
      type: String,
      default: "P_AGENT"
    }
  },
  { timestamps: true }
);

const KycData = mongoose.model("KycData", kycSchema);
export default KycData;