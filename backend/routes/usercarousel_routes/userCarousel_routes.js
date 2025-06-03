import express from "express";
import uploadFile from "../../middleware/fileUpload.js";
import { deleteCarousel, firstUserCarousel, firstUserCarouselList, updateCarousel } from "../../controller/usercarousel_controller/usercarousel.controller.js";

const router1 = express.Router();

// add carousel
router1.post("/carousel", uploadFile ,firstUserCarousel);
// view carousel lists
router1.get("/view", firstUserCarouselList);
// update carousel
router1.put("/carousel/update/:id", uploadFile, updateCarousel);
// delete list of carousel
router1.delete("/deletecarousel/:id", deleteCarousel);

export default router1;