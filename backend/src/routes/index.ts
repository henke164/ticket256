import express from "express";
const router = express.Router();

import tickets from "./tickets";
import raffles from "./raffles";

router.use("/tickets", tickets);
router.use("/raffles", raffles);

export default router;
