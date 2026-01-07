let forcedWinners: (number | string)[] = [];
let currentWinnerIndex = 0; // Track which winner to pick next (round-robin)

// Generate 1000+ entries
const generateDefaultEntries = () => {
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

// Entries state
let entries: string[] = generateDefaultEntries();

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
