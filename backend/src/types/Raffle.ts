import { Ticket } from "./Ticket";

export type Raffle = {
  id: string;
  secretSeed: string | undefined;
  publicHash: string;
  tickets: Ticket[];
  endTime: Date;
  ticketChecksum: string | null;
};
