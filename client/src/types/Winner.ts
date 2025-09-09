import type { Ticket } from "./Ticket";

export type Winner = {
  seed: string;
  ticket: Ticket;
  val: string;
};
