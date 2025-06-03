// src/features/quote/quoteSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  BusinessType: "",
  QuotationNumber: null,
  PolicyProductType: "",
  ProposalDate: "",
  VehicleDetails: {
    VehicleOwnerShip: "",
    RegistrationDate: "",
    TempRegistrationDate: "",
    RegistrationNumber: "",
    ChassisNumber: "",
    EngineNumber: "",
    RTOCode: "",
    RTOName: "",
    ManufactureCode: "",
    ManufactureName: "",
    ModelCode: "",
    ModelName: "",
    HPCC: "",
    MonthOfManufacture: "",
    YearOfManufacture: "",
    VehicleClassCode: "",
    VehicleClassName: "",
    SeatingCapacity: "",
    CarryingCapacity: "",
    BodyTypeCode: "",
    BodyTypeName: "",
    FuelType: "",
    GVW: "",
    SeagmentType: "",
    TACMakeCode: "",
    ExShowroomPrice: "",
    IDVofVehicle: "",
    HigherIDV: "",
    LowerIDV: "",
    IDVofChassis: "",
    Zone: "",
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const submitMagmaProposal = createAsyncThunk('magma/proposal/submitProposal', async (proposalData) => {
  const response = await axios.post('http://localhost:7000/magma/proposal', proposalData);
  return response?.data;
});

const proposalMagmaSlice = createSlice({
  name: 'magmaproposal',
  initialState,
  reducers: {
    addMagmaProposal: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addMagmaVehicleDetails: (state, action) => {
      const { field, value } = action.payload;
      state.VehicleDetails[field] = value;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(submitMagmaProposal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitMagmaProposal.fulfilled, (state, action) => {
        state.status = 'succeeded' || action.response.message;
        // You can update the state with the response data if needed
        state.message = action.payload;
      })
      .addCase(submitMagmaProposal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addMagmaProposal, addMagmaVehicleDetails } = proposalMagmaSlice.actions;

export default proposalMagmaSlice.reducer;