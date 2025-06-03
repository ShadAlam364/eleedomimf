import axios from "axios";
import dotenv from "dotenv";
import KycData from "../../models/magma_hdi/kyc.js";

dotenv.config();
const { MAGMA_BASE_URL, MAGMA_GCV_UPLOAD_KYC_LINK, MAGMA_GCV_EKYC_OTP_LINK } = process.env;

// Step 1: Get CKYC Response
export const getCkycResponse = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { cKYCType, cKYCNumber, DOB, Gender, FullName, BusinessSourceType } = req.body;

    const response = await axios.post(
      `${MAGMA_BASE_URL}/MotorProduct/api/KYC/GetCKYCResponse`,
      {
        cKYCType,
        cKYCNumber,
        DOB,
        Gender,
        FullName,
        BusinessSourceType
      },
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json"
        }
      }
    );

    // Save KYC response to database
    if (response.data.ServiceResult === "Success") {
      await saveKycResponse({
        documentType: cKYCType,
        responseData: response.data,
        kycNumber: cKYCNumber,
        status: "success"
      });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("CKYC Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { ErrorText: error.message });
  }
};

// Step 2: Send eKYC OTP
export const sendEkycOtp = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { UIDNo, MobileNumber, DOB, BusinessSourceType } = req.body;

    // Validate mobile number
    if (!MobileNumber || !/^\d{10}$/.test(MobileNumber)) {
      return res.status(400).json({ 
        ServiceResult: "Error", 
        ErrorText: "Mobile number must be exactly 10 digits" 
      });
    }

    const response = await axios.post(
      `${MAGMA_GCV_EKYC_OTP_LINK}`,
      {
        UIDNo,
        MobileNumber,
        DOB,
        BusinessSourceType
      },
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("eKYC OTP Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { ErrorText: error.message });
  }
};

// Step 3: Verify eKYC OTP
export const verifyEkycOtp = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { OTP, ClientID, UIDNo, BusinessSourceType } = req.body;

    const response = await axios.post(
      `${MAGMA_GCV_EKYC_OTP_LINK}`,
      {
        OTP,
        ClientID,
        UIDNo,
        BusinessSourceType
      },
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json"
        }
      }
    );

    // Save KYC response to database if successful
    if (response.data.ServiceResult === "Success") {
      await saveKycResponse({
        documentType: "AADHAAR",
        responseData: response.data,
        kycNumber: UIDNo,
        status: "success"
      });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("eKYC Verification Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { ErrorText: error.message });
  }
};

// Step 4: Upload KYC Document
export const uploadKycDocument = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { DocumentName, DocumentType, Base64DocumentString, BusinessSourceType } = req.body;

    const response = await axios.post(
      `${MAGMA_GCV_UPLOAD_KYC_LINK}`,
      {
        DocumentName,
        DocumentType,
        Base64DocumentString,
        BusinessSourceType
      },
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json"
        }
      }
    );

    // Save KYC response to database if successful
    if (response.data.ServiceResult === "Success") {
      await saveKycResponse({
        documentType: DocumentName,
        responseData: response.data,
        documentUrl: Base64DocumentString,
        status: "success"
      });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Document Upload Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { ErrorText: error.message });
  }
};

// Helper function to save KYC response
const saveKycResponse = async (data) => {
  try {
    const kycData = new KycData({
      documentType: data.documentType,
      responseData: data.responseData,
      documentUrl: data.documentUrl,
      kycNumber: data.kycNumber,
      verificationStatus: data.status === "success" ? "success" : "failed"
    });
    await kycData.save();
    return kycData;
  } catch (error) {
    console.error("Error saving KYC data:", error);
    throw error;
  }
};