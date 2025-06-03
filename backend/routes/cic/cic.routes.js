import express from "express";
import { addCicRegister, cicPasswordReset, forgotCicPassword, loginCic } from "../../controller/cic/cic.controller.js";

const cics = express.Router();

cics.post("/signup", addCicRegister);
cics.post("/login", loginCic);
// password change
cics.post("/forgot/cics/pass", forgotCicPassword);
cics.post("/pass/:id/:token", cicPasswordReset);


export default cics;