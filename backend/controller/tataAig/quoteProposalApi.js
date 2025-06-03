import dotenv from "dotenv";
import axios from "axios";
import { MongoClient } from "mongodb";
dotenv.config();
const {
  MONGODB_URI,
  DB_NAME,
  COLLECTION_TATACAR,
  TATA_AIG_4_WHEELER_QUOTE_URL,
  TATA_AIG_4_WHEELER_PROPOSAL_URL,
  TATA_AIG_4_WHEELER_MANUFACTURER,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT,
  TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT_PRICEDATA,
  TATA_AIG_4_WHEELER_RTO,
  TATA_AIG_4_WHEELER_RTO_BY_CODE,
  TATA_AIG_4_WHEELER_PINCODE,
  TATA_AIG_4_WHEELER_PREV_INSURER,
  TATA_AIG_4_WHEELER_FINANCIER,
  TATA_AIG_4_WHEELER_POLICY_PLAN,
  TATA_AIG_4_WHEELER_CKYC_URL,
  TATA_AIG_4_WHEELER_XAPI_KEY,
  TATA_AIG_4_WHEELER_VIS_URL,
  TATA_AIG_4_WHEELER_VIS_KEY,
  TATA_AIG_4_WHEELER_PAYMENT_URL,
  TATA_AIG_4_WHEELER_PAYMENT_KEY,
  TATA_AIG_4_WHEELER_VERIFY_PAYMENT_URL,
  TATA_AIG_4_WHEELER_FORM60_URL,
  TATA_AIG_4_WHEELER_FORM60_KEY,
  TATA_AIG_4_WHEELER_AADHAAR_OTP_URL,
  TATA_AIG_4_WHEELER_AADHAAR_OTP_KEY,
  TATA_AIG_4_WHEELER_POLICY_DOWNLOAD_URL,
  TATA_AIG_4_WHEELER_DOWNLOAD_KEY,
} = process.env;

const quoteApi = async (req, res) => {
  const authToken = req?.headers?.authorization;
  const data = req?.body;

  try {
    // Make the API call to Tata AIG
    const response = await axios.post(`${TATA_AIG_4_WHEELER_QUOTE_URL}`, data, {
      headers: {
        Authorization: `${authToken}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_XAPI_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the API call was successful
    if (response.data.status === 200) {
      // Extract the `data` object from the API response
      const quoteData = response?.data?.data[0]; // Access the first item in the `data` array

      // Connect to MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      // Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);

      // Insert the `data` object into the collection
      await collection.insertOne({
        ...quoteData, // Spread the `data` object
        timestamp: new Date(), // Add a timestamp
      });

      // Close the MongoDB connection
      await client.close();

      // Return the API response and MongoDB insertion result
      return res.json(response?.data);
    } else {
      // If the API call was not successful, return the response without saving
      return res.json(response?.data);
    }
  } catch (error) {
    // Handle errors
    console.error("Error in quoteApi:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error?.response?.data || error?.message,
    });
  }
};

const proposalApi = async (req, res) => {
  const authToken = req.headers.authorization;
  const datas = req.body; // Extract data from the request body

  try {
    // Step 1: Make the API request
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_PROPOSAL_URL}`,
      datas,
      {
        headers: {
          Authorization: `${authToken}`,
          "x-api-key": `${TATA_AIG_4_WHEELER_XAPI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === 200) {
      const proposalData = response?.data?.data[0]; // Access the first item in the `data` array

      // Step 3: Connect to MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      // Step 4: Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);

      // Step 5: Find the document in the collection using `policy_id`
      const dbData = await collection.findOne({
        "data.policy_id": proposalData?.policy_id,
      });

      if (!dbData) {
        // If no matching document is found, return a 404 response
        await client.close();
        return res
          .status(404)
          .json({ message: "Quotation Number not found in our server" });
      } else {
        // Step 6: Perform additional checks
        if (
          dbData?.data?.policy_id === proposalData?.policy_id &&
          dbData?.data?.quote_id === proposalData?.quote_id &&
          dbData?.data?.proposal_id === proposalData?.proposal_id &&
          dbData?.data?.quote_no === proposalData?.quote_no
        ) {
          // Step 7: Update the matching document with the new response data
          await collection.updateOne(
            { "data.policy_id": proposalData?.policy_id }, // Filter by `policy_id`
            { $set: { proposalData } } // Update the `data` field with the new response
          );

          // Step 8: Close the MongoDB connection
          await client.close();

          // Return success response
          return res.json(response?.data);
        } else {
          // If data does not match, return a 400 response
          await client.close();
          return res
            .status(400)
            .json({ message: "Data mismatch: Document not updated" });
        }
      }
    } else {
      // If the API response is not successful, return the response as is
      return res.json(response?.data);
    }
  } catch (error) {
    
    return res
      .status(500)
      .json({ error: error?.response?.data?.message || error.message });
  }
};

const cKycApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request bodY
  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_CKYC_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_XAPI_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        product: url[2], // Pass the pin as a query parameter
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

const aadhaarOtpApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_AADHAAR_OTP_URL}`,
      datas,
      {
        headers: {
          Authorization: `${authorization}`,
          "x-api-key": `${TATA_AIG_4_WHEELER_AADHAAR_OTP_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          product: url[2], // Pass the pin as a query parameter
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

const formSixtyApi = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body

  try {
    // Step 1: Make the API request
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_FORM60_URL}`,
      datas,
      {
        headers: {
          Authorization: `${authorization}`,
          "x-api-key": `${TATA_AIG_4_WHEELER_FORM60_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          product: url[2], // Pass the product as a query parameter
        },
      }
    );

    // Step 2: Check if the API response is successful
    if (response.data.status === 200) {
      const ovdData = response?.data?.data;

      // Step 3: Connect to MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      // Step 4: Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);

      // Step 5: Find the document in the collection using `proposal_id`
      const dbData = await collection.findOne({
        "data.proposal_id": ovdData?.proposal_id,
      });

      if (!dbData) {
        // If no matching document is found, return a 404 response
        await client.close();
        return res
          .status(404)
          .json({ message: "Proposal Number not found in our server" });
      } else {
        // Step 6: Check if the `proposal_id` matches
        if (dbData?.data?.proposal_id === ovdData?.proposal_id) {
          // Step 7: Update the matching document with the new response data
          await collection.updateOne(
            { "data.proposal_id": ovdData?.proposal_id }, // Filter by `proposal_id`
            { $set: { ovdData } } // Update the `data` field with the new response
          );

          // Step 8: Close the MongoDB connection
          await client.close();

          // Return success response
          return res.json(response?.data);
        } else {
          // If `proposal_id` does not match, return a 400 response
          await client.close();
          return res
            .status(400)
            .json({ message: "Proposal Number not matched to our server" });
        }
      }
    } else {
      // If the API response is not successful, return the response as is
      return res.json(response?.data);
    }
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      error: error?.response?.data?.message || error.message,
    });
  }
};

const verifyInspectionApi = async (req, res) => {
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body

  try {
    const response = await axios.post(`${TATA_AIG_4_WHEELER_VIS_URL}`, datas, {
      headers: {
        Authorization: `${authorization}`,
        "x-api-key": `${TATA_AIG_4_WHEELER_VIS_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === 200) {
      const inspectionStatus = response?.data?.data[0];
      // Step 3: Connect to MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      // Step 4: Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);

      // Step 5: Find the document in the collection using `proposal_id`
      const dbData = await collection.findOne({
        "proposalData.proposal_no": inspectionStatus?.proposal_no,
      });
      if (!dbData) {
        // If no matching document is found, return a 404 response
        await client.close();
        return res
          .status(404)
          .json({ message: "Proposal Number not found in our Server" });
      } else {
        // Step 6: Check if the `proposal_id` matches
        if (
          dbData?.proposalData?.proposal_no === inspectionStatus?.proposal_no
        ) {
          // Step 7: Update the matching document with the new response data
          await collection.updateOne(
            { "proposalData.proposal_no": inspectionStatus?.proposal_no }, // Filter by `proposal_id`
            { $set: { inspectionStatus } } // Update the `data` field with the new response
          );
          // Step 8: Close the MongoDB connection
          await client.close();
          // Return success response
          return res.json(response?.data);
        } else {
          // If `proposal_id` does not match, return a 400 response
          await client.close();
          return res
            .status(400)
            .json({ message: "Proposal Number not matched to our server" });
        }
      }
    } else {
      // If the API response is not successful, return the response as is
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const makePayment = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_PAYMENT_URL}`,
      datas,
      {
        headers: {
          Authorization: `${authorization}`,
          "x-api-key": `${TATA_AIG_4_WHEELER_PAYMENT_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          product: url[2], // Pass the pin as a query parameter
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

const verifyPayment = async (req, res) => {
  let url = req.originalUrl.match(/\/([^/]+)\/([^/]+)/);
  const { authorization } = req.headers;
  const datas = req.body; // Extract data from the request body
  try {
    const headers = {
      Authorization: `${authorization}`,
      "x-api-key": `${TATA_AIG_4_WHEELER_PAYMENT_KEY}`,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_VERIFY_PAYMENT_URL}`,
      datas,
      {
        headers,
        params: {
          product: url[2], // Pass the pin as a query parameter
        },
      }
    );

    if (response.data.status === 200) {
      const payment = response?.data?.data;
      // Step 3: Connect to MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      // Step 4: Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);

      // Step 5: Find the document in the collection using `proposal_id`
      const dbData = await collection.findOne({
        "proposalData.policy_id": payment?.policy_id,
      });
      if (!dbData) {
        // If no matching document is found, return a 404 response
        await client.close();
        return res
          .status(404)
          .json({ message: "Policy Id not found in our Server" });
      } else {
        // Step 6: Check if the `proposal_id` matches
        if (dbData?.proposalData?.policy_id === payment?.policy_id) {
          // Step 7: Update the matching document with the new response data
          await collection.updateOne(
            { "proposalData.policy_id": payment?.policy_id }, // Filter by `proposal_id`
            { $set: { payment } } // Update the `data` field with the new response
          );
          // Step 8: Close the MongoDB connection
          await client.close();
          // Return success response
          return res.json(response?.data);
        } else {
          // If `proposal_id` does not match, return a 400 response
          await client.close();
          return res
            .status(400)
            .json({ message: "Policy Id not matched to our server" });
        }
      }
    } else {
      // If the API response is not successful, return the response as is
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data);
  }
};

const motorPolicyDownload = async (req, res) => {
  const { authorization } = req.headers;
  const { encrypted_policy_id } = req.params; // Extract the policy number from the request body

  if (!encrypted_policy_id) {
    return res.status(400).json({
      error: true,
      message: "Policy number is required",
    });
  }
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_POLICY_DOWNLOAD_URL}/${encrypted_policy_id}`,
      {
        headers: {
          Authorization: `${authorization}`,
          "x-api-key": `${TATA_AIG_4_WHEELER_DOWNLOAD_KEY}`,
        },
      }
    );

    if (response?.data?.download === true) {
      const policyPdf = response?.data?.byteStream;
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      // Step 4: Get the database and collection
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_TATACAR);
      // await collection.updateOne(
      //   { "payment.encrypted_policy_id": encrypted_policy_id }, // Filter by `proposal_id`
      //   { $set: { "payment.policyPdf": policyPdf } } // Update the `data` field with the new response
      // );
      // Step 8: Close the MongoDB connection
      await client.close();
      return res.json(response?.data);
    } else {
      await client.close();
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error?.response?.data?.message);
  }
};

const vehicleMfg = async (req, res) => {
  const uatToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_MANUFACTURER}`, {
      headers: {
        Authorization: `${uatToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModel = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL}/${code}/${name}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariant = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT}/${code}/${name}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariantData = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { code, name, vcode, vname } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT}/${code}/${name}/${vcode}/${vname}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const vehicleMfgModelVariantPriceData = async (req, res) => {
  const uatToken = req.headers.authorization;
  const { id, name, vid, vname, txt_uw_zone } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_MANUFACTURER_MODEL_VARIANT_PRICEDATA}/${id}/${name}/${vid}/${vname}/${txt_uw_zone}`,
      {
        headers: {
          Authorization: `${uatToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rto = async (req, res) => {
  const rtoToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_RTO}`, {
      headers: {
        Authorization: `${rtoToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rtoByLocation = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { code, location } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_RTO}/${code}/${location}`,
      {
        headers: {
          Authorization: `${rtoToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const rtoByCode = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { code1, code2 } = req.params;
  try {
    const response = await axios.get(
      `${TATA_AIG_4_WHEELER_RTO_BY_CODE}/${code1}/${code2}`,
      {
        headers: {
          Authorization: `${rtoToken}`,
        },
      }
    );
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const pincode = async (req, res) => {
  const rtoToken = req.headers.authorization;
  const { pin } = req.query;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_PINCODE}`, {
      headers: {
        Authorization: `${rtoToken}`,
      },
      params: {
        pin, // Pass the pin as a query parameter
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const prevInsurer = async (req, res) => {
  const prevToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_PREV_INSURER}`, {
      headers: {
        Authorization: `${prevToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const financier = async (req, res) => {
  const prevToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_FINANCIER}`, {
      headers: {
        Authorization: `${prevToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};

const policyPlans = async (req, res) => {
  const planToken = req.headers.authorization;
  try {
    const response = await axios.get(`${TATA_AIG_4_WHEELER_POLICY_PLAN}`, {
      headers: {
        Authorization: `${planToken}`,
      },
    });
    if (response.data.status === 0) {
      return res.json(response?.data);
    } else {
      return res.json(response?.data);
    }
  } catch (error) {
    return res.json(error.response?.data?.txt);
  }
};


const tataPolicyData = async (req, res) => {
  const tokens = req?.headers?.authorization;
  if (!tokens) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const pageNumber = Math.max(parseInt(req?.query?.page) || 1, 1); // Default: Page 1
  const limitNumber = Math.max(parseInt(req?.query?.limit) || 10, 1); // Default: 10 items per page
  const skip = (pageNumber - 1) * limitNumber;

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_TATACAR);

    // Fetch paginated data
    const cars = await collection.find()
      .sort({ quote_datetime: -1 })
      .skip(skip)
      .limit(limitNumber)
      .toArray();

    // Get total count of documents
    const totalItems = await collection.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNumber);

    return res.status(200).json({
      data: cars,
      totalItems,
      totalPages,
      currentPage: pageNumber,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }
};

export {
  quoteApi,
  proposalApi,
  vehicleMfg,
  vehicleMfgModel,
  vehicleMfgModelVariant,
  vehicleMfgModelVariantData,
  vehicleMfgModelVariantPriceData,
  rto,
  rtoByLocation,
  rtoByCode,
  pincode,
  prevInsurer,
  financier,
  policyPlans,
  cKycApi,
  formSixtyApi,
  verifyInspectionApi,
  makePayment,
  verifyPayment,
  aadhaarOtpApi,
  motorPolicyDownload,
  tataPolicyData,
};
