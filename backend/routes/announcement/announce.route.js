import express from "express";
import {
  addAnnoucement,
  deleteAnnoucement,
  getActiveAnnoucement,
  getAnnoucement,
  updateAnnoucement,
} from "../../controller/Anouncement/Anouncement.js";
const announce = express.Router();
// Route to add claims
announce.post("/add", addAnnoucement);

// Route to get all announcement
announce.get("/view", getAnnoucement);
announce.get("/active/view", getActiveAnnoucement);

// Route to get announcement by branch
announce.patch("/:id", updateAnnoucement);

// Route to delete a announcement
announce.delete("/delete/:id", deleteAnnoucement);

export default announce;
