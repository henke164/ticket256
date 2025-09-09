<script setup lang="ts">
import DecideWinner from '@/components/fairness/DecideWinner.vue';
import { ref } from 'vue'
import 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css'

const selectedOption = ref<'try' | 'js' | 'python'>('try')
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
</style>

<template>
  <div class="row">
    <div class="column content">
      <h1>How can I know that the game is fair?</h1>
      <div>
        <span class="header">Winner algorithm</span>
        The algorithm that decides which ticket is the winner is calculated based on:
        <ul>
          <li>(1)Secret Seed</li>
          <li>(2)Ticket Checksum</li>
          <li>(3)The first Bitcoin Block hash that is created after the Raffle is ended</li>
        </ul>

        By adding (3), we can prove that we are not able to know the outcome of the raffle.
        I.e. If the raffle ends at 2025-09-08 18:43, the first Bitcoin Block hash will be:
        <a
          href="https://www.blockchain.com/explorer/blocks/btc/913766">000000000000000000015d06da2dfc973244f48e46063a6c0d26565f59984f5b</a>
        <br>
        <br>
        <br>
        Seed = Secret Seed + Ticket Checksum + Bitcoin Block Hash
      </div>
    </div>
    <div class="column code">
      <DecideWinner />
    </div>
  </div>
</template>

<script lang="ts">
</script>
<style scoped></style>
