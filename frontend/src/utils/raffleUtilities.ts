import type { Ticket } from "@/types/Ticket";

async function generateHmacSHA256(seed: string, ticketId: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", 
    enc.encode(seed), 
    { name: "HMAC", hash: "SHA-256" }, 
    false, 
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(ticketId)
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


export async function getTicketChecksum(ticketIds: string[]): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ticketIds.join(''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const ticketChecksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return ticketChecksum;
}

export async function getSHA256Hash(seed: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function decideWinner(
  tickets: Ticket[],
  secretSeed: string,
  ticketChecksum: string,
  bitcoinBlockHash: string
) {
  const seed = secretSeed + ticketChecksum + bitcoinBlockHash;

  // Create a top-list based on the random seed
  let leader = null;
  for (const t of tickets) {
    const h = await generateHmacSHA256(seed, t.number.toString());
    const value = BigInt("0x" + h);

    if (!leader || value > leader.value) {
      leader = { ticket: t, value };
    }
  }

  // Winner is the top scored ticket
  return leader?.ticket || null;
}