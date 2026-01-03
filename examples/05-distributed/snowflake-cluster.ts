/**
 * Multi-node Snowflake setup
 *
 * Each node in the cluster needs a unique workerId/datacenterId.
 */

import { createUid } from '@oxog/uid';
import { snowflakePlugin } from '@oxog/uid/plugins';

// Create Snowflake instance for datacenter 1, worker 1
const node1 = createUid();
node1.use(snowflakePlugin);
node1.snowflake.configure({
  workerId: 1,
  datacenterId: 1
});

// Create Snowflake instance for datacenter 1, worker 2
const node2 = createUid();
node2.use(snowflakePlugin);
node2.snowflake.configure({
  workerId: 2,
  datacenterId: 1
});

// Generate IDs from different nodes
const id1 = node1.snowflake();
const id2 = node2.snowflake();

console.log('Node 1:', id1);
console.log('Node 2:', id2);

// Both IDs are unique and sortable
console.log('Are different:', id1 !== id2);
// Output: true
