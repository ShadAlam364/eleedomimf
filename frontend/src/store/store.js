// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './features/tokenMagmaSlice';
import quoteReducer from './features/quoteMagmaSlice';
import proposalReducer from './features/proposalMagmaSlice';
import kycMagmaReducer from './features/kycMagmaSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    magmaquote: quoteReducer,
    magmaproposal: proposalReducer,
    kycMagma: kycMagmaReducer,
  },
});