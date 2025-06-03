import express from "express";
import {createRecord, deleteDailyVisits, getDailyVisitByBranch, getDailyVisits, getDailyVisitStaffType, updateDailyVisits, updateDailyVisitsDate, } from "../../controller/DailyVisitContoller/daily.controller.js";
import { lists } from "../../controller/ncb/ncb.contoller.js";
const dailyVisited = express.Router();

dailyVisited.post('/create', createRecord);
dailyVisited.get('/view', getDailyVisits);
dailyVisited.get('/view/:branch/:id', getDailyVisitStaffType);
dailyVisited.get('/view/:branch', getDailyVisitByBranch);
dailyVisited.put('/update/:id', updateDailyVisits);
dailyVisited.put('/update/current/:id', updateDailyVisitsDate);
dailyVisited.delete('/view/:listsName', lists);
dailyVisited.delete('/delete/:id', deleteDailyVisits);

export default dailyVisited;
