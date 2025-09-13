<script setup lang="ts">
import { ref } from 'vue';
import { getTicketChecksum, getSHA256Hash } from '@/utils/raffleUtilities';
import { fetchRaffle } from '@/services/raffleService';
import type { Ticket } from '@/types/Ticket';
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

const raffleId = ref<string>('3c5b2ba1-02ba-46f8-a1f3-959cbbdcd60c');
const ticketIds = ref<string>('');
const checksum = ref<string>('');
const error = ref<string>('');
const sha256 = ref<string>('');
const seed = ref<string>('');
const selectedOption = ref<'try' | 'js' | 'python'>('try');

async function loadFromRaffle() {
  error.value = '';
  const raffle = await fetchRaffle(raffleId.value);
  if (raffle === null) {
    error.value = 'Raffle not found!';
    checksum.value = '';
    return;
  }

  const ids = raffle?.tickets.map((t: Ticket) => t.id);
  ticketIds.value = JSON.stringify(ids, null, 2);
  checksum.value = await getTicketChecksum(ids);
}

async function updateSHA256() {
  sha256.value = await getSHA256Hash(seed.value);
}

async function updateChecksum() {
  const ids = ticketIds.value.split('\n');
  checksum.value = await getTicketChecksum(ids);
}
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
  padding: 20px;
  color: white;
  background-color: #22344e;
}

.intro h2 {
  font-size: 16px;
  color: #eee;
}

.try-form {
  color: #ddd;
  margin: 20px;
}

.try-form div {
  margin-top: 10px;
}

textarea {
  width: 500px;
  height: 300px;
  color: #ddd;
  background: #22344e;
}

input {
  color: #ddd;
  background: #22344e;
  width: 500px;
}

.error-msg {
  margin-left: 5px;
  color: rgb(208, 34, 34);
}
</style>

<template>
  <div>
    <div class="intro">
      <h2>Verify winner</h2>
      Below is the algorithm that decides the winning ticket.
    </div>
    <div class="selector">
      <a
        v-on:click="selectedOption = 'try'"
        :class="selectedOption === 'try' ? 'selected' : undefined"
        >Try</a
      >
      <a
        v-on:click="selectedOption = 'js'"
        :class="selectedOption === 'js' ? 'selected' : undefined"
        >Javascript</a
      >
      <a
        v-on:click="selectedOption = 'python'"
        :class="selectedOption === 'python' ? 'selected' : undefined"
        >Python</a
      >
    </div>
    <div class="try-form" v-if="selectedOption === 'try'">
      <div>
        Load tickets from raffle:<br />
        <input type="text" placeholder="Raffle Id" v-model="raffleId" />
        <button v-on:click="loadFromRaffle()">Load</button>
        <span class="error-msg">{{ error }}</span>
      </div>

      <div style="margin-top: 10px">
        Secret Seed:<br />
        <input
          type="text"
          placeholder="Enter secret seed"
          v-model="seed"
          v-on:keyup="updateSHA256()"
        />
      </div>
      <div style="margin-top: 10px">
        Bitcoin Hash:<br />
        <input placeholder="Enter Bitcoin hash" type="text" />
      </div>
      <div style="margin-top: 10px">
        Tickets:<br />
        <textarea
          v-model="ticketIds"
          v-on:keyup="updateChecksum()"
          placeholder="abc123
def456
ghi789"
        ></textarea>
      </div>
      <div style="margin-top: 10px">
        Checksum of all tickets above:<br />
        <div>
          <b>{{ checksum || '-' }}</b>
        </div>
      </div>
    </div>
    <highlightjs v-if="selectedOption === 'js'" language="js" :code="winnerAlgorithmJs" />
    <highlightjs
      v-if="selectedOption === 'python'"
      language="python"
      :code="winnerAlgorithmPython"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    value = int(h, 16)

    if leader is None or value > leader['value']:
      leader = {'ticket': t, 'value': value}

  return leader['ticket'] if leader else None

`;

export default defineComponent({
  name: 'DecideWinner',
});
</script>
<style scoped></style>
