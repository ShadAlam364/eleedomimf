import express from "express";
import { createClaim, deleteClaimed, getAllClaims, getClaimsByBranch, updateClaim } from "../../controller/cicform/claimformed.js";

const formsClaimed = express.Router();

formsClaimed.post("/add", createClaim);
formsClaimed.get("/view", getAllClaims);
formsClaimed.get("/view/:branch", getClaimsByBranch);
formsClaimed.put("/update/:id", updateClaim);
formsClaimed.delete("/delete/:id", deleteClaimed);


export default formsClaimed;