import {
  createRaffle,
  getRaffle,
  getRaffles,
  getWinner,
} from "@/services/raffleService";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Getting raffles");
  const raffles = await getRaffles();
  res.send(raffles);
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
