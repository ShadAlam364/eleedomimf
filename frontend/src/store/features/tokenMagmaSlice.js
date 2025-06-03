import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import VITE_DATA from '../../config/config';

const initialState = {
  token: null, // Store the token
  tokenValid: false, // Flag to indicate if the token is valid
  tokenError: null, // Store any token-related errors
  loading: false, // Loading state for token generation
};

export const fetchToken = createAsyncThunk('magma/quote/fetchToken', async () => {
  const response = await axios.get(`${VITE_DATA}/magma/tokens`);
  // Validate userName from token response
  if (response.status === 200 && response.statusText) { 
    return response?.data?.access_token; // Return the entire token response
  }
});

const tokenMagmaSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = null;
      state.tokenValid = false;
      state.tokenError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.loading = true;
        state.tokenValid = false;
        state.tokenError = null;
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Store the token
        state.tokenValid = true; // Mark token as valid
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.loading = false;
        state.tokenValid = false;
        state.tokenError = action.error.message; // Store the error message
      });
  },
});

// Define selectors
export const selectTokenValid = (state) => state.token.tokenValid;
export const selectTokenError = (state) => state.token.tokenError;

export const { clearToken } = tokenMagmaSlice.actions;

export default tokenMagmaSlice.reducer;