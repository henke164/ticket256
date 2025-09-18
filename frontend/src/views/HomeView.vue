<script setup lang="ts">
import { fetchRaffles } from '@/services/raffleService';
import type { Raffle } from '@/types/Raffle';
import { ref } from 'vue';

const raffles = ref<Raffle[]>([]);

async function loadRaffles() {
  const res = await fetchRaffles();
  raffles.value = res;
}

loadRaffles();
</script>

<template>
  <div class="content">
    <h1>Raffles</h1>
    {{ raffles }}
  </div>
</template>

<style scoped>
.content {
  padding: 0px 40px;
}
</style>
