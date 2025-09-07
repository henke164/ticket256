export type Ticket = {
  number: number;
  raffleId: string | undefined;
  id: string;
  ownerId: number | null;
  purchasedAt: Date | null;
};
