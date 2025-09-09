<script setup lang="ts">
import { ref } from 'vue'
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css'

const selectedOption = ref<'try' | 'js' | 'python'>('try')
</script>

<style scoped>
  .selector {
    background-color: #374964;
    padding: 10px 20px;
  }

  .selector a {
    font-weight: bold;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
  }
  
  .selector a.selected {
    text-decoration: underline;
  }

  .selector a:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .intro {
    margin: 20px;
    color: white;
  }

  .intro h2 {
    font-size: 16px;
    color: #eee;
  }
</style>

<template>
  <div>
    <div class="intro">
      <h2>Verify game winner</h2>
      Below is the algorithm that decides the winning ticket. 
    </div>
    <div class="selector">
      <a v-on:click="selectedOption = 'try'" :class="selectedOption === 'try' ? 'selected' : undefined">Try</a>
      <a v-on:click="selectedOption = 'js'" :class="selectedOption === 'js' ? 'selected' : undefined">Javascript</a>
      <a v-on:click="selectedOption = 'python'" :class="selectedOption === 'python' ? 'selected' : undefined">Python</a>
    </div>
    <highlightjs v-if="selectedOption === 'js'" language="js" :code="winnerAlgorithmJs" />
    <highlightjs v-if="selectedOption === 'python'" language="python" :code="winnerAlgorithmPython" />
  </div>
</template>

<script lang="ts">
const winnerAlgorithmJs = `
function hmacValue(seed, ticketNumber) {
  return crypto
    .createHmac("sha256", seed)
    .update(ticketNumber)
    .digest("hex");
}

function decideWinner(raffle, secretSeed, ticketChecksum, bitcoinBlockHash) {
  const seed = secretSeed + ticketChecksum + bitcoinBlockHash;

  // Only tickets with owners. If the ticket isn't bought, it cannot win
  const ownedTickets = raffle.tickets.filter((t) => t.ownerId !== null);
  if (ownedTickets.length === 0) {
    return null;
  }

  // Create a top-list based on the random seed
  let leader = null;
  for (const t of ownedTickets) {
    const h = hmacValue(seed, t.number.toString());
    const value = BigInt("0x" + h);

    if (!leader || value > leader.value) {
      leader = { ticket: t, value };
    }
  }

  // Winner is the top scored ticket
  return leader?.ticket || null;
}
`;

const winnerAlgorithmPython = `
import hmac
import hashlib

def hmac_value(seed: str, ticket_number: str) -> str:
  return hmac.new(seed.encode(), ticket_number.encode(), hashlib.sha256).hexdigest()

def decide_winner(raffle: dict, secret_seed: str, ticket_checksum: str, bitcoin_block_hash: str):
  seed = secret_seed + ticket_checksum + bitcoin_block_hash

  owned_tickets = [t for t in raffle.get('tickets', []) if t.get('ownerId') is not None]
  if not owned_tickets:
    return None

  leader = None
  for t in owned_tickets:
    h = hmac_value(seed, str(t['number']))
    value = int(h, 16)  # Konvertera hex till ett heltal

    if leader is None or value > leader['value']:
      leader = {'ticket': t, 'value': value}

  return leader['ticket'] if leader else None

`;
</script>
<style scoped></style>
