import Resolver from '@forge/resolver';
import api, { route, storage } from "@forge/api";

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

resolver.define('getUserName', async (req) => {
  const { userId } = req.payload;
  console.log('getUserName payload:', req.payload);
  
  try {
    const result = await api.asApp().requestJira(route`/rest/api/3/user?accountId=${userId}`);
    const status = result.status;
    if (status === 200) {
      const user = await result.json();
      return user.displayName;
    } else {
      console.error('Error fetching user name:', status);
      return 'User';
    }
  } catch (error) {
    console.error('Error invoking getUserName:', error);
    return 'User';
  }
});

export const handler = resolver.getDefinitions();
