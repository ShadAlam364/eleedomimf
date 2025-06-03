import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const {
  MAGMA_TOKEN,
  MAGMA_GRANT_TYPE,
  MAGMA_USERNAME,
  MAGMA_PWD,
  MAGMA_COMP_NAME,
} = process.env;

const magmaToken = async (req, res) => {
  try {
    const formData = {
      grant_type: MAGMA_GRANT_TYPE,
      username: MAGMA_USERNAME,
      Password: MAGMA_PWD,
      CompanyName: MAGMA_COMP_NAME,
    };
    const result = await axios.post(MAGMA_TOKEN, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const filteredResponse = {
      access_token: result.data.access_token,
      token_type: result.data.token_type
    };
    return res.status(200).json(filteredResponse);
  } catch (error) {
    console.error(error);
  }
};

export default magmaToken;
