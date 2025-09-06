import express from "express";
const router = express.Router();

import tickets from "./tickets";
import game from "./game";

router.use("/tickets", tickets);
router.use("/game", game);

export default router;
