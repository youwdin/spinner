import { getEntries } from '../utils/spinState';

export default defineEventHandler(() => {
  return {
    entries: getEntries(),
  };
});
