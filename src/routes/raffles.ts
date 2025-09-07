import { createRaffle, getRaffle, getWinner } from "@/services/raffleService";
import fs from "fs";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const html = fs
    .readFileSync(__dirname + "/../views/createDraw.html")
    .toString();
  res.send(html);
});

router.get("/:id", async (req, res) => {
  const raffle = await getRaffle(req.params.id, true);
  res.send(raffle);
});

router.post("/start", async (req, res) => {
  const { tickets, endTime } = req.body;
  const raffle = await createRaffle(tickets, endTime);
  res.send(raffle);
});

router.post("/winner/:id", async (req, res) => {
  const raffle = await getRaffle(req.params.id, true);
  if (raffle === null) {
    return res.sendStatus(404);
  }

  const winner = await getWinner(raffle);
  res.send(winner);
});

export default router;
