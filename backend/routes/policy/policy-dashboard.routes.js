import express from "express";
import { policydata, updatePolicyStatus } from "../../controller/policy_controller/policy-dashboard.controller.js";
const router = express.Router();


router.get("/dashboard/get-data", policydata);
router.post("/update-status", updatePolicyStatus);

export default router;