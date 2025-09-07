import fs from "fs";
import { Raffle } from "@/types/Raffle";
import crypto, { randomUUID } from "crypto";
import { createTicket } from "./ticketService";
import getCurrentBlock from "./blockService";
import { Winner } from "@/types/Winner";

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
  endTime: string
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
    ticketHash: null,
  };

  for (let i = 0; i < tickets; i++) {
    const ticket = await createTicket(i + 1, raffle);
    raffle.tickets.push(ticket);
  }

  const ticketIds = raffle.tickets.map((t) => t.id).join("");
  raffle.ticketHash = crypto
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

export async function getWinner(raffle: Raffle): Promise<Winner> {
  let seed = await getCurrentBlock(1);
  seed += raffle.secretSeed;

  const mapped = raffle.tickets
    .filter((t) => t.ownerId !== null)
    .map((t) => {
      const h = hmacValue(seed, t.number.toString());
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
