<script setup lang="ts">
import { ref } from 'vue';
import { fetchRaffle } from '@/services/raffleService';
import type { Ticket } from "@/types/Ticket";
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

const raffleId = ref<string>('3c5b2ba1-02ba-46f8-a1f3-959cbbdcd60c');
const ticketIds = ref<string>('');
const checksum = ref<string>('');
const error = ref<string>('');
const checksumError = ref<string>('');
const selectedOption = ref<'try' | 'js' | 'python'>('js');

async function loadFromRaffle() {
  error.value = "";
  const raffle = await fetchRaffle(raffleId.value);
  if (raffle === null) {
    error.value = "Raffle not found!";
    checksum.value = "";
    return;
  }

  const ids = raffle?.tickets.map((t: Ticket) => t.id);
  ticketIds.value = JSON.stringify(ids, null, 2);
  checksumError.value = "";
  checksum.value = await getTicketChecksum(ids);
}

async function updateChecksum() {
  let ids = [];
  try {
    ids = JSON.parse(ticketIds.value);
    checksumError.value = "";
  } catch {
    checksumError.value = "Invalid JSON-format";
    checksum.value = "";
    return;
  }
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
    background: #22344e
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
      <h2>(2) Ticket Checksum</h2>
      When participating in a raffle, you recieve the Ticket Checksum in the receipt.
      You can load all tickets and verify that no additional tickets are added or removed from the raffle.
    </div>
    <div class="selector">
      <a v-on:click="selectedOption = 'js'" :class="selectedOption === 'js' ? 'selected' : undefined">Javascript</a>
      <a v-on:click="selectedOption = 'python'" :class="selectedOption === 'python' ? 'selected' : undefined">Python</a>
      <a v-on:click="selectedOption = 'try'" :class="selectedOption === 'try' ? 'selected' : undefined">Try it</a>
    </div>
    <div class="try-form" v-if="selectedOption === 'try'">
      <div>
        Load tickets from raffle:<br>
        <input type="text" placeholder="Raffle Id" v-model="raffleId">
        <button v-on:click="loadFromRaffle()">Load</button>
        <span class="error-msg">{{error}}</span>
      </div>
      <div>
        Tickets:<br>
        <textarea v-model="ticketIds" v-on:keyup="updateChecksum()" placeholder='["abc123", "def456"]'></textarea>
        <div class="error-msg">{{ checksumError }}</div>
      </div>
      <div>
        Checksum of all tickets above:<br>
        <input type="text" v-model="checksum" disabled>
      </div>
    </div>
    <highlightjs v-if="selectedOption === 'js'" language="js" :code="verifyJs" />
    <highlightjs v-if="selectedOption === 'python'" language="python" :code="verifyPython" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

async function getTicketChecksum(ticketIds: string[]) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ticketIds.join(''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const ticketChecksum = hashArray
    .map(b => b.toString(16)
    .padStart(2, '0')).join('');

  return ticketChecksum;
}

const verifyJs = `
async function getTicketChecksum(ticketIds) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ticketIds.join(''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const ticketChecksum = hashArray
    .map(b => b.toString(16)
    .padStart(2, '0')).join('');

  return ticketChecksum;
}

const ticketIds = [
  // Add all ticket ids here
  '63140d1c',
  'e4019bd3',
];

getTicketChecksum(ticketIds).then(checksum => {
  console.log(checksum);
});
`;

const verifyPython = `
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
  name: 'VerifyTickets',
});
</script>
<style scoped></style>
