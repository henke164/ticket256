import { Game } from "@/types/Game";
import crypto, { randomUUID } from "crypto";
import { createTicket } from "./ticketService";
import { Ticket } from "@/types/Ticket";
import getCurrentBlock from "./blockService";
import { Winner } from "@/types/Winner";

function hmacValue(serverSeed: string, ticketNumber: crypto.BinaryLike) {
  return crypto
    .createHmac("sha256", serverSeed)
    .update(ticketNumber)
    .digest("hex");
}

export async function createGame(tickets: number): Promise<Game> {
  const secretSeed = crypto.randomBytes(32).toString("hex");
  const publicHash = crypto
    .createHash("sha256")
    .update(secretSeed)
    .digest("hex");

  const game: Game = {
    id: randomUUID(),
    secretSeed,
    publicHash,
    tickets: [],
    blockHeight: 913467,
    endTime: Date.now() + 60000 * 60 * 24,
  };

  for (let i = 0; i < tickets; i++) {
    const ticket = await createTicket(i + 1, game);
    game.tickets.push(ticket);
  }

  return game;
}

export async function getWinner(game: Game): Promise<Winner> {
  let seed = await getCurrentBlock(game.blockHeight);
  seed += game.secretSeed;

  const mapped = game.tickets
    .filter((t) => t.ownerId !== null)
    .map((t) => {
      const h = hmacValue(seed, t.id);
      const val = BigInt("0x" + h);
      return {
        ticket: t,
        h,
        val,
      };
    });

  mapped.sort((a, b) => (a.val > b.val ? -1 : 1));
  const winner = mapped[0];
  if (!winner) {
    throw Error("Winner not found!");
  }

  return {
    ticket: winner.ticket,
    h: winner.h,
    seed: seed,
    val: winner.val.toString(),
  };
}
