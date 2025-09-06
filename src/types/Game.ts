import { Ticket } from "./Ticket";

export type Game = {
  id: string;
  secretSeed: string;
  publicHash: string;
  tickets: Ticket[];
  blockHeight: number;
  endTime: number;
};
