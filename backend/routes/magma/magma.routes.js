import express from "express";
import { magmaGcvEkyc, magmaGcvEkycOtp, magmaGcvEkycUpload, magmaGcvGenPayment, magmaGcvGetCkyc, magmaGcvPolicyDownload, magmaGcvProposals, magmaGcvProposalModification, magmaGcvProposalStatus, magmaGcvQuote } from "../../controller/magma_hdi/magma_api.js";
import magmaToken from "../../controller/magma_hdi/magmaauth.js";
import { getCkycResponse, sendEkycOtp, verifyEkycOtp, uploadKycDocument } from "../../controller/magma_hdi/kyc.controller.js";

const magmaRoute = express.Router();

// Token generation
magmaRoute.get("/tokens", magmaToken);

// KYC routes
magmaRoute.post("/kyc/ckyc", getCkycResponse);
magmaRoute.post("/kyc/ekyc/send-otp", sendEkycOtp);
magmaRoute.post("/kyc/ekyc/verify", verifyEkycOtp);
magmaRoute.post("/kyc/document/upload", uploadKycDocument);

// Existing routes
magmaRoute.post("/gcv/quote", magmaGcvQuote);
magmaRoute.post("/gcv/proposal", magmaGcvProposals);
magmaRoute.post("/gcv/prop/status", magmaGcvProposalStatus);
magmaRoute.post("/gcv/getkyc", magmaGcvGetCkyc);
magmaRoute.post("/gcv/ekyc/otp", magmaGcvEkycOtp);
magmaRoute.post("/gcv/ekyc", magmaGcvEkyc);
magmaRoute.post("/gcv/ekyc/upload", magmaGcvEkycUpload);
magmaRoute.post("/gcv/pay", magmaGcvGenPayment);
magmaRoute.post("/gcv/download/policy", magmaGcvPolicyDownload);
magmaRoute.post("/gcv/proposal/mod", magmaGcvProposalModification);

export default magmaRoute;