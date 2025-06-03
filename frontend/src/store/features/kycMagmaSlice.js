import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    kycData: null,
    loading: false,
    error: null,
    success: false
};

// Create async thunk for submitting KYC form data
export const submitKycForm = createAsyncThunk(
    'kyc/submitForm',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/magma/kyc', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const kycMagmaSlice = createSlice({
    name: 'kycMagma',
    initialState,
    reducers: {
        resetKycState: (state) => {
            state.kycData = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitKycForm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitKycForm.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.kycData = action.payload;
            })
            .addCase(submitKycForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetKycState } = kycMagmaSlice.actions;
export default kycMagmaSlice.reducer;