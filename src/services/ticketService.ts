import { Raffle } from "@/types/Raffle";
import { Ticket } from "@/types/Ticket";
import { randomUUID } from "crypto";

export async function createTicket(
  number: number,
  raffle: Raffle
): Promise<Ticket> {
  const ticket: Ticket = {
    id: randomUUID(),
    raffleId: raffle.id,
    number,
    ownerId: 1,
    purchasedAt: null,
  };

  return ticket;
}
