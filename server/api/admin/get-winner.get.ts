import { getForcedWinners, getForcedWinner } from '../../utils/spinState';

export default defineEventHandler(() => {
  const forcedWinners = getForcedWinners();
  const forcedWinner = getForcedWinner(); // For backwards compatibility

  return {
    forcedWinner,
    forcedWinners,
    isRandom: forcedWinners.length === 0,
  };
});
