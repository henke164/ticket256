import fs from "fs";
import { Raffle } from "@/types/Raffle";
import crypto, { randomUUID } from "crypto";
import { createTicket } from "./ticketService";
import getCurrentBlock from "./blockService";
import { Ticket } from "@/types/Ticket";

type RaffleLeader = {
  ticket: Ticket | null;
  value: bigint;
};

function hmacValue(serverSeed: string, ticketNumber: crypto.BinaryLike) {
  return crypto
    .createHmac("sha256", serverSeed)
    .update(ticketNumber)
    .digest("hex");
}

export async function getRaffle(id: string, isPublic: boolean) {
  if (!fs.existsSync(`${__dirname}/../raffles/${id}.json`)) {
    return null;
  }

  const json = fs
    .readFileSync(`${__dirname}/../raffles/${id}.json`)
    .toString("utf-8");

  const raffle = JSON.parse(json) as Raffle;

  if (isPublic === true) {
    raffle.secretSeed = undefined;
  }

  for (const ticket of raffle.tickets) {
    ticket.raffleId = undefined;
  }

  return raffle;
}

export async function createRaffle(
  tickets: number,
  endTime: string,
): Promise<Raffle> {
  const secretSeed = crypto.randomBytes(32).toString("hex");

  const publicHash = crypto
    .createHash("sha256")
    .update(secretSeed)
    .digest("hex");

  const raffle: Raffle = {
    id: randomUUID(),
    secretSeed,
    publicHash,
    tickets: [],
    endTime: new Date(endTime),
    ticketChecksum: null,
  };

  for (let i = 0; i < tickets; i++) {
    const ticket = await createTicket(i + 1, raffle);
    raffle.tickets.push(ticket);
  }

  const ticketIds = raffle.tickets.map((t) => t.id).join("");
  raffle.ticketChecksum = crypto
    .createHash("sha256")
    .update(ticketIds, "utf8")
    .digest("hex");

  const rafflesDir = `${__dirname}/../raffles`;
  if (!fs.existsSync(rafflesDir)) {
    fs.mkdirSync(rafflesDir);
  }

  fs.writeFileSync(`${rafflesDir}/${raffle.id}.json`, JSON.stringify(raffle));

  return raffle;
}

export async function getWinner(raffle: Raffle): Promise<Ticket | null> {
  let seed = raffle.secretSeed || "";
  seed += raffle.ticketChecksum || "";
  seed += await getCurrentBlock(1);

  const ownedTickets = raffle.tickets.filter(
    (t) => t.ownerId !== null && t.purchasedAt,
  );

  if (ownedTickets.length === 0) {
    return null;
  }

  let leader: RaffleLeader | null = null;

  for (const t of ownedTickets) {
    const h = hmacValue(seed, t.number.toString());
    const value = BigInt("0x" + h);

    if (!leader || value > leader.value) {
      leader = { ticket: t, value };
    }
  }

  return leader?.ticket || null;
}
