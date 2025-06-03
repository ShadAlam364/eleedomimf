import express from "express";
const hrouter = express.Router();
import { hrSalaryController, viewHrSalary, updateHRSalary, deleteHRSalary } from "../../controller/human_resources/salaryhr.controller.js";
import { deleteHrGenSalary, genHrSalaryController, salaryHrList, updateHrGenSalary,  } from "../../controller/human_resources/gensalary.controller.js";
import { exUsers } from "../../controller/DailyVisitContoller/daily.controller.js";

// add or view branch
hrouter.post("/hr/addsalary", hrSalaryController);
hrouter.get("/hr/viewsalary", viewHrSalary);
hrouter.put("/hr/update/salary/:id", updateHRSalary);
hrouter.delete("/hr/delete/salary/:id", deleteHRSalary);

// generated hr salary
hrouter.post("/hr/gensalary", genHrSalaryController);
hrouter.get("/hr/viewgen/salary", salaryHrList);
hrouter.get("/hr/ex/users/clear", exUsers);
hrouter.put("/hr/updategen/salary/:id", updateHrGenSalary);
hrouter.delete("/hr/deletegen/salary/:id", deleteHrGenSalary);


export default hrouter;