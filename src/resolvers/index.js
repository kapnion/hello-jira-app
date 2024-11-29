import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);
  return 'Hello, world!';
});

resolver.define('saveElapsedTime', async (req) => {
  const { issueId, userId, elapsedTime } = req.payload;
  console.log('saveElapsedTime payload:', req.payload);
  await storage.entity('elapsedTime').set(`${issueId}-${userId}`, { elapsedTime });
  return { success: true };
});

resolver.define('loadElapsedTime', async (req) => {
  const { issueId, userId } = req.payload;
  console.log('loadElapsedTime payload:', req.payload);
  const storedData = await storage.entity('elapsedTime').get(`${issueId}-${userId}`);
  return storedData ? storedData.elapsedTime : 0;
});

export const handler = resolver.getDefinitions();
