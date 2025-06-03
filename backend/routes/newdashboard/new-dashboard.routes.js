import express from "express";
import { newdashboarddata } from "../../controller/newdashboard_controller/new-dashboard.controller.js";
const router = express.Router();


router.get("/dashboard/getnewdashboarddata", newdashboarddata);

export default router;