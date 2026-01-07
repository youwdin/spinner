let forcedWinners: (number | string)[] = [];
let currentWinnerIndex = 0; // Track which winner to pick next (round-robin)

// Entries state
let entries: string[] = [
  'Ali',
  'Beatriz',
  'Diya',
  'Eric',
  'Fatima',
  'Gabriel',
  'Hanna',
  'Fortuna',
];

export const setEntries = (values: string[]) => {
  entries = values;
};

export const getEntries = () => {
  return entries;
};

export const setForcedWinners = (values: (number | string)[]) => {
  forcedWinners = values;
  currentWinnerIndex = 0; // Reset to start when new winners are set
};

export const getForcedWinners = () => {
  return forcedWinners;
};

export const clearForcedWinners = () => {
  forcedWinners = [];
  currentWinnerIndex = 0;
};

// Get the next winner in round-robin rotation
export const getNextForcedWinner = () => {
  if (forcedWinners.length === 0) {
    return null;
  }

  // Get the current winner
  const winner = forcedWinners[currentWinnerIndex];

  // Move to next winner (wrap around to 0 if we reach the end)
  currentWinnerIndex = (currentWinnerIndex + 1) % forcedWinners.length;

  return winner;
};

// Legacy support for single winner
export const setForcedWinner = (value: number | string | null) => {
  forcedWinners = value !== null ? [value] : [];
  currentWinnerIndex = 0;
};

export const getForcedWinner = () => {
  return forcedWinners.length > 0 ? forcedWinners[0] : null;
};
