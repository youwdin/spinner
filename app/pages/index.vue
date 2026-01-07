<template>
  <div class="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row">
    <!-- Left side - Wheel -->
    <div class="flex-1 flex items-center justify-center p-4">
      <SpinnerWheel ref="spinnerWheel" :entries="entries" @remove-entry="handleRemoveEntry" />
    </div>

    <!-- Right side - Info Panel -->
    <div class="w-full lg:w-96 bg-[#0d0d0d] border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
      <div class="p-6 space-y-6">
        <div>
          <h2 class="text-xl font-bold text-white mb-3">Entries ({{ entries.length >= 1000 ? '1000+' : entries.length }})</h2>

          <!-- Action buttons -->
          <div class="flex gap-2 mb-4">
            <button
              @click="shuffleEntries"
              class="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 active:scale-95 transition-all touch-manipulation font-medium flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
              Shuffle
            </button>
            <button
              @click="triggerSpin"
              class="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 active:scale-95 transition-all touch-manipulation font-medium flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Spin
            </button>
          </div>

          <!-- Entries textarea -->
          <div class="relative">
            <textarea
              v-model="entriesText"
              @input="updateEntriesFromText"
              placeholder="Enter names (one per line)&#10;Ali&#10;Beatriz&#10;Diya&#10;Eric"
              class="w-full h-96 bg-[#1a1a1a] text-white text-lg p-4 rounded-lg border-2 border-yellow-600/50 focus:border-yellow-500 focus:outline-none resize-none font-sans"
              style="line-height: 1.8;"
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const spinnerWheel = ref();

const triggerSpin = () => {
  spinnerWheel.value?.spin();
};

const generateEntries = () => {
  const names = [
    'Adi', 'Agus', 'Ahmad', 'Aisyah', 'Aldi', 'Amir', 'Andi', 'Angga', 'Ani', 'Anita',
    'Arif', 'Asep', 'Bagas', 'Bagus', 'Bambang', 'Budi', 'Candra', 'Cici', 'Cindy', 'Citra',
    'Dani', 'Dedi', 'Deny', 'Dewi', 'Dian', 'Dimas', 'Dina', 'Dwi', 'Eka', 'Eko',
    'Endang', 'Erni', 'Fajar', 'Fani', 'Farhan', 'Fatimah', 'Feri', 'Fitri', 'Galih', 'Gilang',
    'Gunawan', 'Hadi', 'Hana', 'Hendra', 'Heri', 'Herman', 'Ika', 'Ilham', 'Imam', 'Indah',
    'Indra', 'Irfan', 'Irwan', 'Joko', 'Juli', 'Kiki', 'Lala', 'Lina', 'Lisa', 'Lukman',
    'Made', 'Maya', 'Mega', 'Mira', 'Mulyadi', 'Nana', 'Nanda', 'Nina', 'Nova', 'Novi',
    'Nurul', 'Okta', 'Putu', 'Putri', 'Rahma', 'Rani', 'Ratna', 'Rena', 'Rian', 'Ricky',
    'Rina', 'Rini', 'Rizal', 'Rizki', 'Rosa', 'Sari', 'Sinta', 'Siti', 'Sri', 'Suci',
    'Surya', 'Tina', 'Tono', 'Tri', 'Udin', 'Vani', 'Vera', 'Wati', 'Wawan', 'Yani',
    'Yanto', 'Yoga', 'Yudi', 'Yuli', 'Zahra', 'Zaki'
  ];
  const entries: string[] = [];
  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    entries.push(name);
  }
  return entries;
};

const defaultEntries = generateEntries();

const entriesText = ref(defaultEntries.join('\n'));

const entries = computed(() => {
  return entriesText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
});

const updateEntriesFromText = () => {
  // Sync to server
  syncEntriesToServer();
};

const syncEntriesToServer = async () => {
  try {
    await $fetch('/api/entries', {
      method: 'POST',
      body: { entries: entries.value },
    });
  } catch (error) {
    console.error('Failed to sync entries:', error);
  }
};

const loadEntriesFromServer = async () => {
  try {
    const response = await $fetch('/api/entries');
    if (response.entries && response.entries.length > 0) {
      entriesText.value = response.entries.join('\n');
    }
  } catch (error) {
    console.error('Failed to load entries:', error);
  }
};

loadEntriesFromServer();

const shuffleEntries = () => {
  const lines = entriesText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }

  entriesText.value = lines.join('\n');
  syncEntriesToServer();
};

const sortEntries = () => {
  const lines = entriesText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  lines.sort((a, b) => a.localeCompare(b));

  entriesText.value = lines.join('\n');
  syncEntriesToServer();
};

const handleRemoveEntry = (name: string) => {
  const lines = entriesText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line !== name);

  entriesText.value = lines.join('\n');
  syncEntriesToServer();
};

</script>
