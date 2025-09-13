<script setup lang="ts">
import { ref } from 'vue';
import { fetchRaffle } from '@/services/raffleService';
import { getSHA256Hash } from '@/utils/raffleUtilities';
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

const raffleId = ref<string>('3c5b2ba1-02ba-46f8-a1f3-959cbbdcd60c');
const seed = ref<string>('');
const sha256 = ref<string>('');
const error = ref<string>('');
const sha256Error = ref<string>('');
const selectedOption = ref<'try' | 'js' | 'python'>('js');

async function loadFromRaffle() {
  error.value = '';
  const raffle = await fetchRaffle(raffleId.value);
  if (raffle === null) {
    error.value = 'Raffle not found!';
    sha256.value = '';
    return;
  }

  if (!raffle.secretSeed) {
    error.value = 'Raffle Secret is not yet published!';
    sha256.value = '';
    return;
  }

  seed.value = raffle.secretSeed;
  sha256Error.value = '';
  sha256.value = await getSHA256Hash(seed.value);
}

async function updateSHA256() {
  sha256.value = await getSHA256Hash(seed.value);
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
      <h2>(1) Secret Seed</h2>
      When participating in a raffle, you recieve the SHA-256 encryption of the Secret Seed in the
      receipt. After a raffle has ended, the Secret Seed is published. You can use this tool to
      verify that the Secret Seed havn't changed.
    </div>
    <div class="selector">
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
      <a
        v-on:click="selectedOption = 'try'"
        :class="selectedOption === 'try' ? 'selected' : undefined"
        >Try it</a
      >
    </div>
    <div class="try-form" v-if="selectedOption === 'try'">
      <div>
        Load Secret seed from raffle:<br />
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
        Public SHA-256 Encrypted:
        <div>
          <b>{{ sha256 || '-' }}</b>
        </div>
        <div>
          This should be the same Public Hash that you recieved in the receipt to guaranee that the
          Secret Seed havn't changed.<br />
          You can also use other SHA-256 calculators for example:
          <a href="https://emn178.github.io/online-tools/sha256.html" target="_blank"
            >https://emn178.github.io/online-tools/sha256.html</a
          >
        </div>
      </div>
    </div>
    <highlightjs v-if="selectedOption === 'js'" language="js" :code="verifyJs" />
    <highlightjs v-if="selectedOption === 'python'" language="python" :code="verifyPython" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const verifyJs = `
async function getSHA256Hash(seed) {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

getSHA256Hash('INSERT-SECRET-SEED-HERE').then(console.log);
`;

const verifyPython = `
import hashlib

def get_sha256_hash(secret_seed: str) -> str:
    return hashlib.sha256(secret_seed.encode("utf-8")).hexdigest()

public_hash = get_sha256_hash("INSERT-SECRET-SEED-HERE")
print(public_hash)
`;

export default defineComponent({
  name: 'VerifyTickets',
});
</script>
<style scoped></style>
