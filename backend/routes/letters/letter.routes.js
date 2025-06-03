import express from "express";
const letters = express.Router();
import { addUserOfferLetter, OfferLetterList, offersDelete, updateLetters } from  '../../controller/offerletter/offerLetter.controller.js';
import { lists2 } from "../../controller/hradmin/hradmin.controller.js";

letters.post("/add/offer", addUserOfferLetter);
letters.get("/view/offer", OfferLetterList);
letters.put("/update/letter/:id", updateLetters);
letters.delete('/view/:listsName', lists2);
// letters.put("/:empid/leave/:leaveid", updateLeaveStatus);
letters.delete("/delete/offer/:id", offersDelete);
export default letters;