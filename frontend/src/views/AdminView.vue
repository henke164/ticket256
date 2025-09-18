<script setup lang="ts">
import { ref } from 'vue';
import { createRaffle } from '@/services/raffleService';

const ticketCount = ref<number>(100);
const duration = ref<number>(1);

async function create() {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + duration.value);
  const raffle = await createRaffle(ticketCount.value, endTime);
  console.log(raffle);
}
</script>

<template>
  <div class="content">
    <h1>Admin</h1>
    <h4>Create Raffle</h4>
    <table>
      <tbody>
        <tr>
          <td>Tickets:</td>
          <td>
            <input v-model="ticketCount" type="number" />
          </td>
        </tr>

        <tr>
          <td>Duration (hours):</td>
          <td>
            <input type="number" placeholder="1" value="1" />
          </td>
        </tr>

        <tr>
          <td></td>
          <td>
            <button v-on:click="create()">Create</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.content {
  padding: 0px 40px;
}
</style>
