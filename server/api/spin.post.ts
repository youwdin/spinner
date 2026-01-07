import { getNextForcedWinner } from '../utils/spinState';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { entries } = body;

  const nextForcedWinner = getNextForcedWinner();

  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Entries array is required and must not be empty',
    });
  }

  const options = entries;
  let winner: string;
  let winnerIndex: number;

  console.log('=== BACKEND SPIN DEBUG ===');
  console.log('Received entries:', entries);
  console.log('Next forced winner:', nextForcedWinner);

  if (nextForcedWinner !== null) {
    // Use the next winner in round-robin rotation
    winnerIndex = typeof nextForcedWinner === 'number'
      ? nextForcedWinner
      : options.indexOf(nextForcedWinner);

    console.log('Forced winner type:', typeof nextForcedWinner);
    console.log('Calculated winnerIndex:', winnerIndex);

    if (winnerIndex === -1 || winnerIndex >= options.length) {
      // If the forced winner is not in the current entries, pick random
      console.warn('⚠️ Forced winner not found in entries! Picking random.');
      winnerIndex = Math.floor(Math.random() * options.length);
    }
  } else {
    // No forced winners set, pick random
    console.log('No forced winners set, picking random');
    winnerIndex = Math.floor(Math.random() * options.length);
  }

  winner = options[winnerIndex];

  console.log('Final winner:', winner);
  console.log('Final winnerIndex:', winnerIndex);
  console.log('options[' + winnerIndex + ']:', options[winnerIndex]);

  return {
    winner,
    winnerIndex,
    options,
  };
});
