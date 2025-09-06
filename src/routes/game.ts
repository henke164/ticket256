import { createGame, getWinner } from "@/services/gameService";
import express from "express";
const router = express.Router();

router.post("/start", async (req, res) => {
  const { tickets } = req.body;
  const game = await createGame(tickets);
  res.send(game);
});

router.post("/winner", async (req, res) => {
  const game = req.body;
  const winner = await getWinner(game);
  console.log(winner);

  res.send(winner);
});

export default router;
