import type { Raffle } from "@/types/Raffle";

const apiUrl = `${document.location.protocol}//${document.location.hostname}:3001`;

export async function fetchRaffle(raffleId: string): Promise<Raffle | null> {
  try {
    const raffleResponse = await fetch(`${apiUrl}/raffles/${raffleId}`);
    if (raffleResponse.status === 404) {
      return null;
    }
    return await raffleResponse.json();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log('An unknown error occurred');
    }
    return null;
  }
}