import express from "express";
import { addDailyLeger,  updateDailyLeger, updateMonthlyLeger, viewLeger } from "../../controller/dailyLeger/leger.controller.js";
const legers = express.Router();

legers.post("/entry1", addDailyLeger);
legers.put("/daily/update", updateDailyLeger);
legers.put("/monthly/update", updateMonthlyLeger);
// legers.post("/send/messages", whtsappSend);
legers.get("/view", viewLeger);

export default legers;