import express from "express";
import { createCancel, getAllCancel, getCancelByBranch, updateCancel, deleteCancel} from "../../controller/cicform/cancelform.js";

const cancels = express.Router();

// Route to add claims
cancels.post("/add", createCancel);

// Route to get all claims
cancels.get("/view", getAllCancel);

// Route to get claims by branch
cancels.get("/view/:branch", getCancelByBranch);

// Route to update a claim
cancels.put("/update/:id", updateCancel);

// Route to delete a claim
cancels.delete("/delete/:id", deleteCancel);

export default cancels;
