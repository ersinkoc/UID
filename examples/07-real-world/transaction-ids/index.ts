/**
 * Financial Transaction IDs
 *
 * Generate unique, traceable transaction IDs.
 */

import { uid } from '@oxog/uid';
import { cuid2Plugin } from '@oxog/uid/plugins';

uid.use(cuid2Plugin);

interface Transaction {
  id: string;
  amount: number;
  from: string;
  to: string;
  timestamp: Date;
}

class TransactionProcessor {
  private transactions: Map<string, Transaction> = new Map();

  /**
   * Create a new transaction
   */
  createTransaction(amount: number, from: string, to: string): Transaction {
    const transaction: Transaction = {
      id: `txn_${uid.cuid2()}`,
      amount,
      from,
      to,
      timestamp: new Date()
    };

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Get transaction by ID
   */
  getTransaction(id: string): Transaction | null {
    return this.transactions.get(id) ?? null;
  }
}

// Usage
const processor = new TransactionProcessor();

const txn = processor.createTransaction(
  100.0,
  'alice@example.com',
  'bob@example.com'
);

console.log('Transaction ID:', txn.id);
// Output: txn_clh3am5yk0000qj1f8b9g2n7p

console.log('Transaction:', txn);
// Output: { id: 'txn_...', amount: 100, from: '...', to: '...', timestamp: Date }
