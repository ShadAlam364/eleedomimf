import express from "express";
import { createIndorsh, deleteIndorsh, getAllIndorsh, getIndorshsByBranch, updateIndorsh } from "../../controller/cicform/indorshForm.js";

const ind = express.Router();

// Route to add claims
ind.post("/add", createIndorsh);

// Route to get all claims
ind.get("/view", getAllIndorsh);

// Route to get claims by branch
ind.get("/view/:branch", getIndorshsByBranch);

// Route to update a claim
ind.put("/update/:id", updateIndorsh);

// Route to delete a claim
ind.delete("/delete/:id", deleteIndorsh);

export default ind;
