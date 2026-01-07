<template>
  <div class="flex items-center justify-center relative w-full h-screen">
    <div class="relative w-full max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] 2xl:max-w-[800px] aspect-square">
      <!-- Pointer on the right side -->
      <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 xl:translate-x-10 z-20">
        <div class="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[30px] md:border-t-[25px] md:border-b-[25px] md:border-r-[40px] xl:border-t-[30px] xl:border-b-[30px] xl:border-r-[50px] border-t-transparent border-b-transparent border-r-red-600 drop-shadow-lg"></div>
      </div>

      <!-- Spinner wheel -->
      <div
        ref="wheelRef"
        class="w-full h-full rounded-full relative shadow-2xl"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <svg viewBox="0 0 600 600" class="w-full h-full">
          <g v-for="(option, index) in options" :key="index">
            <path
              :d="getSegmentPath(index)"
              :fill="colors[index % colors.length]"
              :stroke="options.length > 50 ? 'none' : '#fff'"
              :stroke-width="options.length > 20 ? 1 : 3"
            />
            <text
              v-if="showText"
              :transform="getTextTransform(index)"
              text-anchor="middle"
              class="fill-white font-bold"
              :style="{
                fontSize: getFontSize() + 'px',
                userSelect: 'none'
              }"
            >
              {{ option }}
            </text>
          </g>
        </svg>

        <!-- Center circle with spin button -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            @click="spin()"
            :disabled="spinning"
            class="w-12 h-12 md:w-14 md:h-14 xl:w-16 xl:h-16 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-xs md:text-sm hover:bg-gray-100 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all touch-manipulation border-2 border-gray-200"
          >
            <span v-if="!spinning" class="text-gray-800 text-xs md:text-sm">SPIN</span>
            <span v-else class="text-gray-500 text-[10px] md:text-xs">Spinning...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Winner Display Modal -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <div
        v-if="showWinner && lastWinner"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <!-- Confetti Animation -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div v-for="i in 100" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
        </div>

        <!-- Winner Card -->
        <div class="relative bg-gradient-to-b from-[#3d2e0a] to-[#1a1302] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform animate-bounce-in border-2 border-yellow-500/50">
          <!-- Decorative top glow -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

          <!-- Header with emoji -->
          <div class="pt-8 pb-4 text-center">
            <div class="text-6xl mb-3">🎉</div>
            <h2 class="text-yellow-400 text-xl md:text-2xl font-bold px-4">Selamat ya!</h2>
            <p class="text-yellow-200/70 text-sm md:text-base mt-1">Kamu berhasil memenangkan</p>
          </div>

          <!-- Prize amount -->
          <div class="px-6 py-4 text-center">
            <div class="inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-transparent bg-clip-text text-3xl md:text-4xl font-extrabold animate-pulse">
              Rp 100.000.000
            </div>
          </div>

          <!-- Winner name -->
          <div class="px-6 py-6 text-center">
            <p class="text-yellow-600 text-sm mb-2">Pemenang:</p>
            <div class="text-white text-4xl md:text-5xl font-bold tracking-wide break-words">
              {{ lastWinner }}
            </div>
          </div>

          <!-- Buttons -->
          <div class="px-6 pb-6 pt-2 flex justify-center gap-3">
            <button
              @click="closeWinner"
              class="px-6 py-3 bg-yellow-900/50 text-yellow-200 rounded-lg font-semibold hover:bg-yellow-800/50 active:scale-95 transition-all touch-manipulation border border-yellow-700/50"
            >
              Tutup
            </button>
            <button
              @click="removeWinner"
              class="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 active:scale-95 transition-all touch-manipulation"
            >
              Hapus & Lanjut
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  entries: string[];
}>();

const options = computed(() => props.entries);

// Hide text when too many entries
const showText = computed(() => props.entries.length <= 20);

const colors = [
  '#5B8CFF',
  '#4CAF50',
  '#FFD54F',
  '#EF5350',
  '#5B8CFF',
  '#FFD54F',
  '#EF5350',
  '#4CAF50',
];

const rotation = ref(0);
const spinning = ref(false);
const lastWinner = ref('');
const showWinner = ref(false);
const wheelRef = ref<HTMLElement | null>(null);

const closeWinner = () => {
  showWinner.value = false;
};

const emit = defineEmits<{
  removeEntry: [name: string]
}>();

const removeWinner = () => {
  if (lastWinner.value) {
    emit('removeEntry', lastWinner.value);
  }
  showWinner.value = false;
};

const getConfettiStyle = (index: number) => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739'];
  const randomX = Math.random() * 100;
  const randomDuration = 2.5 + Math.random() * 1;
  const randomRotation = Math.random() * 360;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  // Stagger the start positions so confetti appears to be continuously falling
  const randomStartY = -(Math.random() * 50);

  return {
    left: `${randomX}%`,
    top: `${randomStartY}%`,
    backgroundColor: randomColor,
    animationDuration: `${randomDuration}s`,
    transform: `rotate(${randomRotation}deg)`,
  };
};

const getSegmentPath = (index: number) => {
  const numSegments = options.value.length;
  const anglePerSegment = 360 / numSegments;
  const startAngle = index * anglePerSegment - 90;
  const endAngle = startAngle + anglePerSegment;

  const centerX = 300;
  const centerY = 300;
  const radius = 300;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

const getTextTransform = (index: number) => {
  const numSegments = options.value.length;
  const anglePerSegment = 360 / numSegments;
  const angle = index * anglePerSegment + anglePerSegment / 2;
  const radius = 220; // Positioned closer to center for better fit

  const angleRad = ((angle - 90) * Math.PI) / 180;
  const x = 300 + radius * Math.cos(angleRad);
  const y = 300 + radius * Math.sin(angleRad);

  // Flip text on bottom half of wheel (between 90° and 270°) so it's always readable
  const textRotation = (angle > 90 && angle < 270) ? angle + 180 : angle;

  return `translate(${x}, ${y}) rotate(${textRotation})`;
};

const getFontSize = () => {
  const numEntries = options.value.length;

  // Dynamically adjust font size based on number of entries
  if (numEntries <= 8) return 28;
  if (numEntries <= 12) return 24;
  if (numEntries <= 16) return 20;
  if (numEntries <= 20) return 18;
  if (numEntries <= 30) return 16;
  if (numEntries <= 40) return 14;
  if (numEntries <= 50) return 12;
  return 10; // For 50+ entries
};

const spin = async () => {
  if (spinning.value) return;

  if (!options.value || options.value.length === 0) {
    alert('Please add at least one entry before spinning!');
    return;
  }

  spinning.value = true;
  lastWinner.value = '';
  showWinner.value = false;

  try {
    const response = await $fetch('/api/spin', {
      method: 'POST',
      body: {
        entries: options.value,
      },
    });

    const { winnerIndex, winner, options: backendOptions } = response;

    console.log('=== SPIN DEBUG ===');
    console.log('Winner from backend:', winner);
    console.log('Winner index from backend:', winnerIndex);
    console.log('Frontend options:', JSON.stringify(options.value));
    console.log('Backend options:', JSON.stringify(backendOptions));
    console.log('Are arrays equal?', JSON.stringify(options.value) === JSON.stringify(backendOptions));
    console.log('Frontend options[' + winnerIndex + ']:', options.value[winnerIndex]);
    console.log('Backend options[' + winnerIndex + ']:', backendOptions?.[winnerIndex]);

    // Critical check: does the winnerIndex match the winner name?
    const expectedWinner = backendOptions?.[winnerIndex] || options.value[winnerIndex];
    if (expectedWinner !== winner) {
      console.error('❌ MISMATCH! Backend says winner is "' + winner + '" but index ' + winnerIndex + ' points to "' + expectedWinner + '"');
    } else {
      console.log('✅ Winner name and index match correctly');
    }

    // Use backend options to ensure consistency
    const backendOptionsArray = backendOptions || options.value;
    const segmentAngle = 360 / backendOptionsArray.length;

    // Calculate the initial position of the target segment's CENTER
    // Segments are drawn with index 0 starting at -90 degrees (top of wheel)
    // The pointer should point to the CENTER of the winning segment
    const targetSegmentCenter = winnerIndex * segmentAngle - 90 + segmentAngle / 2;

    // Pointer is at 0 degrees (right side of wheel)
    // We need to rotate so that the CENTER of the target segment lands at 0 degrees
    const extraSpins = 12;

    // For CLOCKWISE rotation (positive degrees):
    // Final position = Initial position + Rotation
    // We want: targetSegmentCenter + totalRotation = 0 (mod 360)
    // So: totalRotation = -targetSegmentCenter + (360 * extraSpins)
    const totalRotation = 360 * extraSpins - targetSegmentCenter;

    console.log('Segment angle:', segmentAngle);
    console.log('Number of segments:', backendOptionsArray.length);
    console.log('Target winner:', winner);
    console.log('Target winner index:', winnerIndex);
    console.log('Target segment initial CENTER position:', targetSegmentCenter);
    console.log('Total rotation (clockwise):', totalRotation);
    console.log('Expected final CENTER position of winner:', (targetSegmentCenter + totalRotation) % 360);
    console.log('Should equal 0 degrees (pointer position)');

    // CRITICAL FIX: Calculate additional rotation needed from current position
    // Don't just add totalRotation to the remainder - account for current position!
    const currentAngle = rotation.value % 360;
    const targetCurrentPosition = targetSegmentCenter + currentAngle;
    const additionalRotation = 1800 - targetCurrentPosition;

    rotation.value = rotation.value + additionalRotation;

    console.log('Current angle before spin:', currentAngle.toFixed(1) + '°');
    console.log('Target segment current position:', targetCurrentPosition.toFixed(1) + '°');
    console.log('Additional rotation needed:', additionalRotation.toFixed(1) + '°');
    console.log('New total rotation after spin:', rotation.value.toFixed(1) + '°');

    // Log all segment positions after rotation
    console.log('=== SEGMENT POSITIONS AFTER ROTATION ===');
    for (let i = 0; i < backendOptionsArray.length; i++) {
      const segmentCenter = i * segmentAngle - 90 + segmentAngle / 2;
      const finalCenterPosition = (segmentCenter + rotation.value) % 360;
      const isWinner = i === winnerIndex;
      console.log(`Segment ${i} (${backendOptionsArray[i]}): center at ${finalCenterPosition.toFixed(1)}°${isWinner ? ' ⭐ WINNER' : ''}`);
    }
    console.log('Pointer is at: 0° (should point to winner segment CENTER)');

    if (wheelRef.value) {
      wheelRef.value.style.transition = 'transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    }

    setTimeout(() => {
      lastWinner.value = winner;
      spinning.value = false;
      showWinner.value = true;

      if (wheelRef.value) {
        wheelRef.value.style.transition = '';
      }
    }, 10000);
  } catch (error) {
    console.error('Spin failed:', error);
    spinning.value = false;
  }
};

defineExpose({ spin });
</script>

<style scoped>
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotateZ(720deg);
    opacity: 0.3;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear infinite;
  pointer-events: none;
  opacity: 0.9;
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
</style>
