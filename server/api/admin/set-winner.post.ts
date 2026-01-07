import { setForcedWinners, clearForcedWinners, setForcedWinner } from '../../utils/spinState';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { winnerIndex, winnerName, winnerNames } = body;

  // Clear if all values are null/undefined
  if (!winnerIndex && !winnerName && !winnerNames) {
    clearForcedWinners();
    return { success: true, message: 'Forced winners cleared - now random', forcedWinners: [] };
  }

  // Handle multiple winners (array)
  if (winnerNames && Array.isArray(winnerNames)) {
    const validNames = winnerNames
      .filter(name => name && (typeof name === 'string' || typeof name === 'number'))
      .map(name => typeof name === 'string' ? name.trim() : name)
      .filter(name => name !== '');

    if (validNames.length === 0) {
      clearForcedWinners();
      return { success: true, message: 'No valid winners provided, cleared', forcedWinners: [] };
    }

    setForcedWinners(validNames);
    return {
      success: true,
      message: `Forced winners set to: ${validNames.join(', ')}`,
      forcedWinners: validNames,
    };
  }

  // Handle single winner (backwards compatibility)
  if (winnerName !== null && winnerName !== undefined) {
    if (typeof winnerName !== 'string' || winnerName.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'winnerName must be a non-empty string',
      });
    }
    setForcedWinner(winnerName.trim());
    return {
      success: true,
      message: `Forced winner set to name "${winnerName.trim()}"`,
      forcedWinner: winnerName.trim(),
      forcedWinners: [winnerName.trim()],
    };
  }

  if (winnerIndex !== null && winnerIndex !== undefined) {
    if (typeof winnerIndex !== 'number' || winnerIndex < 0) {
      throw createError({
        statusCode: 400,
        message: 'winnerIndex must be a non-negative number, or null for random',
      });
    }
    setForcedWinner(winnerIndex);
    return {
      success: true,
      message: `Forced winner set to index ${winnerIndex}`,
      forcedWinner: winnerIndex,
      forcedWinners: [winnerIndex],
    };
  }

  throw createError({
    statusCode: 400,
    message: 'Either winnerIndex, winnerName, or winnerNames must be provided',
  });
});
