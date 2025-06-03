import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const {
  TATA_AIG_4_WHEELER_TOKEN_LINK,
  TATA_AIG_4_WHEELER_EMAIL,
  TATA_AIG_4_WHEELER_PWD,
  TATA_AIG_4_WHEELER_AUTH_URL,
  TATA_AIG_4_WHEELER_GRANT_TYPE,
  TATA_AIG_4_WHEELER_SCOPE,
  TATA_AIG_4_WHEELER_TOKEN_CLIENT_ID,
  TATA_AIG_4_WHEELER_TOKEN_CLIENT_SECRET,
} = process.env;

// Function to make a POST request to the first API
const fetchUatListsToken = async () => {
  try {
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_TOKEN_LINK}`,
      {
        email: `${TATA_AIG_4_WHEELER_EMAIL}`,
        pwd: `${TATA_AIG_4_WHEELER_PWD}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch UAT token: ${error.message}`);
  }
};

// Function to make a POST request to the second API
const fetchAuthToken = async () => {
  try {
    const response = await axios.post(
      `${TATA_AIG_4_WHEELER_AUTH_URL}`,
      new URLSearchParams({
        grant_type: `${TATA_AIG_4_WHEELER_GRANT_TYPE}`,
        scope: `${TATA_AIG_4_WHEELER_SCOPE}`,
        client_id: `${TATA_AIG_4_WHEELER_TOKEN_CLIENT_ID}`,
        client_secret: `${TATA_AIG_4_WHEELER_TOKEN_CLIENT_SECRET}`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Auth token: ${error.message}`);
    throw new Error(`Failed to fetch Auth token: ${error.message}`);
  }
};

const getCombinedTokens = async () => {
  try {
    // Trigger both API requests simultaneously
    const [uatLists, auth] = await Promise.all([
      fetchUatListsToken(),
      fetchAuthToken(),
    ]);
    // Get the current timestamp
    const currentTime = Date.now();

    // Calculate the expiration time for both tokens (in milliseconds)
    const uatListsExpiresInMs = uatLists.expires_in * 1000; // Assuming `expires_in` is in seconds
    const authExpiresInMs = auth.expires_in * 1000; // Assuming `expires_in` is in seconds
    // Set timers to expire 30 seconds before actual expiration
    const timerDuration =
      Math.min(uatListsExpiresInMs, authExpiresInMs) - 30000; // 30 seconds before the minimum of both
    // Return combined response with timer
    return {
      uatLists,
      auth,
      token_refresh_timer: timerDuration, // Timer duration in milliseconds
    };
  } catch (error) {
    throw new Error(`Error combining tokens: ${error.message}`);
  }
};

// Controller function to get combined tokens
const getTokens = async (req, res) => {
  try {
    const tokens = await getCombinedTokens();
    // Schedule a timer that expires in 29 minutes and 30 seconds
    setTimeout(() => {
      console.log(
        "Your time is up. Restart the policy or fill out the form again."
      );
      // If you want to trigger any other action, you can do it here
    }, tokens.token_refresh_timer || 29 * 60 * 1000 + 30 * 1000);
    res.status(200).json({
      ...tokens,
      message: "Token acquired. You will be notified when your time is up.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getTokens;
