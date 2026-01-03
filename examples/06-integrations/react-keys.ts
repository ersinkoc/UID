/**
 * React list keys
 *
 * Use generated IDs as React component keys.
 */

import { uid } from '@oxog/uid';

interface Item {
  id: string;
  name: string;
}

// Generate items with unique IDs
const items: Item[] = [
  { id: uid.uuid(), name: 'Item 1' },
  { id: uid.uuid(), name: 'Item 2' },
  { id: uid.uuid(), name: 'Item 3' }
];

// Use in React
/*
function ItemList() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
*/

console.log('Items with IDs:', items);
