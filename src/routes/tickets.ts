import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("oK");
});

export default router;
