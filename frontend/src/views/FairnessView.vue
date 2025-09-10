<script setup lang="ts">
import VerifySecretSeed from '../components/fairness/VerifySecretSeed.vue';
import VerifyTickets from '../components/fairness/VerifyTickets.vue';
import DecideWinner from '../components/fairness/DecideWinner.vue';
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 100vh;
}

.column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.content {
  padding: 0px 40px;
}

.code {
  background-color: #0d1117;
}

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

.example {
  margin: 20px;
  color: white;
  border-radius: 10px;
  border: 1px solid #aaa;
  background: #0d1117;
  padding: 20px 30px;
}

.spacing {
  background-color: #374964;
  margin-top: 50px;
  padding-top: 100px;
}
</style>

<template>
  <div class="row">
    <div class="column content">
      <h1>How can I know that the game is fair?</h1>
      <div>
        <h2>Winner algorithm</h2>
        The algorithm that decides which ticket is the winner is calculated based on:
        <ul>
          <li>(1) Secret Seed</li>
          <li>(2) Ticket Checksum</li>
          <li>(3) Bitcoin Block Hash</li>
        </ul>
        Random Seed = Secret Seed + Ticket Checksum + Bitcoin Block Hash

        <h4>(1) Secret Seed</h4>
        When a raffle is created, a public SHA256-encrypted string of the Secret Seed is published.
        This means that we can prove that the Secret Seed is generated when the raffle is created,
        and not manipulated later on.

        <h4>(2) Ticket Checksum</h4>
        All the tickets that are available in a raffle are created at the same time as the Raffle is
        created. Every ticket has a number and an unique identifier.
        <div>
          For example:
          <ul>
            <li>#1. 4df25678</li>
            <li>#2. ef6a8595</li>
            <li>#3. ced38bb0</li>
            <li>...</li>
          </ul>
          The ticket checksum is the SHA256 result of all ticket unique identifiers that are created
          in the raffle. After a raffle-winner is decided, you can verify the Ticket Checksum to
          make sure no tickets have been added or removed.
        </div>

        <h4>(3) The Bitcoin Block Hash</h4>
        We take the first Bitcoin Block hash that is created right after the Raffle is ended, and
        before the winner is decided and add it to the random salt. By adding it, we can prove that
        we are not able to know the outcome of the raffle.
        <div class="example">
          <b>Example:</b><br />If the raffle ends at 2025-09-08 18:43, the first Bitcoin Block hash
          will be:
          <a target="_blank" href="https://www.blockchain.com/explorer/blocks/btc/913766"
            >000000000000000000015d06da2dfc973244f48e46063a6c0d26565f59984f5b</a
          >
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
    <div class="column code">
      <VerifySecretSeed />
      <div class="spacing"></div>
      <VerifyTickets />
      <div class="spacing"></div>
      <DecideWinner />
    </div>
  </div>
</template>

<script lang="ts"></script>
<style scoped></style>
