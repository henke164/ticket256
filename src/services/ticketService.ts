import { Game } from "@/types/Game";
import { Ticket } from "@/types/Ticket";
import { randomUUID } from "crypto";

export async function createTicket(
  number: number,
  game: Game
): Promise<Ticket> {
  const ticket: Ticket = {
    id: randomUUID(),
    gameId: game.id,
    number,
    ownerId: 1,
  };

  return ticket;
}
