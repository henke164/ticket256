import { createRaffle, getRaffle, getWinner } from "@/services/raffleService";
import fs from "fs";
import express from "express";
const router = express.Router();

router.get("/create", async (req, res) => {
  const html = fs
    .readFileSync(__dirname + "/../views/createRaffle.html")
    .toString();
  res.send(html);
});

router.get("/verify", async (req, res) => {
  const html = fs
    .readFileSync(__dirname + "/../views/verifyRaffle.html")
    .toString();
  res.send(html);
});

router.get("/:id", async (req, res) => {
  const raffle = await getRaffle(req.params.id, true);
  if (!raffle) {
    return res.sendStatus(404);
  }
  res.send(raffle);
});

router.post("/", async (req, res) => {
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
