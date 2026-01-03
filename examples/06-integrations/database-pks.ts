/**
 * Database primary keys
 *
 * Use generated IDs as primary keys in databases.
 */

import { uid } from '@oxog/uid';

interface User {
  id: string;
  name: string;
  email: string;
}

// Create user with UUID v4 as primary key
const user1: User = {
  id: uid.uuid(),
  name: 'John Doe',
  email: 'john@example.com'
};

// Create user with CUID2 as primary key
import { cuid2Plugin } from '@oxog/uid/plugins';
uid.use(cuid2Plugin);

const user2: User = {
  id: uid.cuid2(),
  name: 'Jane Doe',
  email: 'jane@example.com'
};

console.log('User 1 (UUID):', user1);
console.log('User 2 (CUID2):', user2);
