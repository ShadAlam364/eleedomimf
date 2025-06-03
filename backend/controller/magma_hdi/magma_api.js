import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import axios from "axios";
dotenv.config();
const {
  MONGODB_URI,
  DB_NAME,
  MAGMA_GCV_QUOTE_LINK,
  MAGMA_GCV_PROPOSAL_LINK,
  MAGMA_GCV_PROPOSAL_STATUS_LINK,
  MAGMA_GCV_GET_CKYC_LINK,
  MAGMA_GCV_EKYC_OTP_LINK,
  MAGMA_GCV_EKYC_LINK,
  MAGMA_GCV_UPLOAD_KYC_LINK,
  MAGMA_GCV_GEN_PAYMENT_LINK,
  MAGMA_GCV_POLICY_DOWNLOAD_LINK,
  MAGMA_GCV_PROPOSAL_MODIFICATION_LINK,
  COLLECTION_MAGMA_COMM_VEH,
  MAGMA_GCV_CUSTOMER_TYPE,
  BUSINESS_CHANNEL_TYPE,
  BUSINESS_SOURCE,
  INTERMEDIARY_CODE,
  INTERMEDIARY_NAME,
  ENTITY_RELATION_SHIP_CODE,
  ENTITY_RELATION_SHIP_NAME,
  CHANNEL_NUMBER,
  DISPLAY_OFFICE_CODE,
  OFFICE_CODE,
  OFFICE_NAME,
  BUSINESS_SOURCE_TYPE,
  SP_CODE,
  SP_NAME
} = process.env;

const magmaGcvQuote = async (req, res) => {
  const authToken = req.headers.authorization;
  const dynamicData = req.body; // Dynamic data from the frontend
  
  try {
    // Make API call to Magma GCV
    const response = await axios.post(`${MAGMA_GCV_QUOTE_LINK}`, dynamicData, {
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    });

    // Check for successful response
    if (response.data.ServiceResult === "Success") {
      const quotation = response.data?.OutputResult;
      const client = new MongoClient(MONGODB_URI);
      
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_MAGMA_COMM_VEH);
        
        // Insert the quote data with timestamp
        // const insertResult = 
        await collection.insertOne({
          quotation,
        });
        
        return res.status(200).json({
          success: true,
          Quotation: quotation,
          // mongoInsertId: insertResult.insertedId
        });
        
      } catch (mongoError) {
        console.error("MongoDB error:", mongoError);
        return res.status(500).json({
          error: "Quote generated but failed to save to database",
          quotation: quotation // Still return the quote even if DB save failed
        });
      } finally {
        await client.close();
      }
      
    } else {
      return res.status(500).json({
        error:  response.data.ErrorText
      });
    }
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: "Failed to generate quote",
      details: error.response?.data || error.message
    });
  }
};

const magmaLists = async(req, res) =>{
  
}

const magmaGcvProposals = async (req, res) => {
  const authToken1 = req.headers.authorization;
  const data1 = req.body;
  try {
    const response1 = await axios.post(`${MAGMA_GCV_PROPOSAL_LINK}`, data1, {
      headers: {
        Authorization: `${authToken1}`,
        "Content-Type": "application/json",
      },
    });
    if (response1.data.status === 200) {
      console.log(response1.data);
      return res.status(201).json(response1?.data);
    } else {
      return res.status(200).json(response1.data);
    }
  } catch (error) {
    return res.json(error.response.data);
  }
};

const magmaGcvProposalStatus = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(
      `${MAGMA_GCV_PROPOSAL_STATUS_LINK}`,
      data,
      {
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvGetCkyc = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${MAGMA_GCV_GET_CKYC_LINK}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvEkycOtp = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${MAGMA_GCV_EKYC_OTP_LINK}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvEkyc = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${MAGMA_GCV_EKYC_LINK}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvEkycUpload = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${MAGMA_GCV_UPLOAD_KYC_LINK}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvGenPayment = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(`${MAGMA_GCV_GEN_PAYMENT_LINK}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvPolicyDownload = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(
      `${MAGMA_GCV_POLICY_DOWNLOAD_LINK}`,
      data,
      {
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const magmaGcvProposalModification = async (req, res) => {
  const authToken = req.headers.authorization;
  const data = req.body;
  try {
    const response = await axios.post(
      `${MAGMA_GCV_PROPOSAL_MODIFICATION_LINK}`,
      data,
      {
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.status === 200) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};
export {
  magmaGcvQuote,
  magmaGcvProposals,
  magmaGcvProposalStatus,
  magmaGcvGetCkyc,
  magmaGcvEkycOtp,
  magmaGcvEkyc,
  magmaGcvEkycUpload,
  magmaGcvGenPayment,
  magmaGcvPolicyDownload,
  magmaGcvProposalModification,
};
