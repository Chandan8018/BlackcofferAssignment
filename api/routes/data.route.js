import express from "express";
import { getData, uploadData } from "../controllers/data.controller.js";

const router = express.Router();

router.post("/upload", uploadData);
router.get("/getdata", getData);

export default router;
