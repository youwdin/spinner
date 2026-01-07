import { setEntries } from '../utils/spinState';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body.entries && Array.isArray(body.entries)) {
    setEntries(body.entries);
  }

  return {
    success: true,
  };
});
