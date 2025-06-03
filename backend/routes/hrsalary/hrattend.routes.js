// attendace of employee
import express from "express";
const hr = express.Router();
import { getHrAttendance, markHrAttendance } from "../../controller/human_resources/hrattendance.controller.js";
hr.post("/mark/attendance/:hrid", markHrAttendance);
hr.get("/attendance/:hrId", getHrAttendance);
export default hr;