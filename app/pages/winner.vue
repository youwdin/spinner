<template>
  <div class="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-white mb-4">Force Winners (3)</h1>
      <div class="bg-[#0d0d0d] rounded-lg p-4 space-y-3 border-2 border-yellow-600/50">
        <p class="text-gray-400 text-sm mb-3">Select up to 3 names. Winner will be randomly picked from these.</p>

        <!-- Winner 1 -->
        <div class="flex items-center gap-2">
          <span class="text-gray-400 text-sm w-6">1.</span>
          <select
            v-model="selectedWinners[0]"
            class="flex-1 px-3 py-2 bg-[#1a1a1a] text-white rounded border border-yellow-600/50 focus:border-yellow-500 focus:outline-none"
          >
            <option value="">None</option>
            <option v-for="entry in entries" :key="entry" :value="entry">
              {{ entry }}
            </option>
          </select>
        </div>

        <!-- Winner 2 -->
        <div class="flex items-center gap-2">
          <span class="text-gray-400 text-sm w-6">2.</span>
          <select
            v-model="selectedWinners[1]"
            class="flex-1 px-3 py-2 bg-[#1a1a1a] text-white rounded border border-yellow-600/50 focus:border-yellow-500 focus:outline-none"
          >
            <option value="">None</option>
            <option v-for="entry in entries" :key="entry" :value="entry">
              {{ entry }}
            </option>
          </select>
        </div>

        <!-- Winner 3 -->
        <div class="flex items-center gap-2">
          <span class="text-gray-400 text-sm w-6">3.</span>
          <select
            v-model="selectedWinners[2]"
            class="flex-1 px-3 py-2 bg-[#1a1a1a] text-white rounded border border-yellow-600/50 focus:border-yellow-500 focus:outline-none"
          >
            <option value="">None</option>
            <option v-for="entry in entries" :key="entry" :value="entry">
              {{ entry }}
            </option>
          </select>
        </div>

        <div class="flex gap-2">
          <button
            @click="setForcedWinners"
            class="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 active:scale-95 transition-all touch-manipulation font-medium"
          >
            Set Winners
          </button>
          <button
            @click="clearForcedWinners"
            class="px-6 py-3 bg-yellow-900/50 text-yellow-200 rounded-lg hover:bg-yellow-800/50 active:scale-95 transition-all touch-manipulation font-medium border border-yellow-700/50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const entries = ref<string[]>([]);
const selectedWinners = ref<string[]>(['', '', '']);
const currentForcedWinners = ref<string[]>([]);

const loadEntries = async () => {
  try {
    const response = await $fetch('/api/entries');
    if (response.entries) {
      entries.value = response.entries;
    }
  } catch (error) {
    console.error('Failed to load entries:', error);
  }
};

const setForcedWinners = async () => {
  const validWinners = selectedWinners.value.filter(w => w && w.trim() !== '');

  try {
    const response = await $fetch('/api/admin/set-winner', {
      method: 'POST',
      body: {
        winnerNames: validWinners.length > 0 ? validWinners : null,
      },
    });

    if (response.success) {
      currentForcedWinners.value = response.forcedWinners || [];
      if (validWinners.length > 0) {
        alert(`Forced winners set to: ${validWinners.join(', ')}`);
      } else {
        alert('Forced winners cleared - spins are now random');
      }
    }
  } catch (error) {
    console.error('Failed to set forced winners:', error);
    alert('Failed to set forced winners');
  }
};

const clearForcedWinners = async () => {
  selectedWinners.value = ['', '', ''];
  try {
    const response = await $fetch('/api/admin/set-winner', {
      method: 'POST',
      body: {
        winnerNames: null,
      },
    });
    currentForcedWinners.value = [];
    alert('Forced winners cleared');
  } catch (error) {
    console.error('Failed to clear forced winners:', error);
  }
};

const loadCurrentWinners = async () => {
  try {
    const response = await $fetch('/api/admin/get-winner');
    if (response.forcedWinners && response.forcedWinners.length > 0) {
      currentForcedWinners.value = response.forcedWinners;
    }
  } catch (error) {
    console.error('Failed to load current winners:', error);
  }
};

loadEntries();
loadCurrentWinners();
</script>
