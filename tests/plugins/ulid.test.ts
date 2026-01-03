/**
 * Tests for ULID plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { ulidPlugin } from '../../src/plugins/ulid/index.js';
import type { UlidApi } from '../../src/plugins/ulid/index.js';

describe('ULID Plugin', () => {
  let kernel: Kernel;
  let ulid: UlidApi;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(ulidPlugin);
    ulid = kernel.getApi<UlidApi>('ulid')!;
  });

  describe('ulid()', () => {
    it('should generate valid ULID', () => {
      const id = ulid();
      expect(id).toMatch(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i);
    });

    it('should be 26 characters', () => {
      expect(ulid().length).toBe(26);
    });
  });

  describe('ulid({ timestamp })', () => {
    it('should accept custom timestamp', () => {
      const timestamp = 1609459200000;
      const id = ulid({ timestamp });
      expect(id).toMatch(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i);
    });
  });

  describe('ulid.monotonic()', () => {
    it('should generate monotonic ULIDs', () => {
      const ids: string[] = [];
      for (let i = 0; i < 10; i++) {
        ids.push(ulid.monotonic());
      }

      for (let i = 1; i < ids.length; i++) {
        expect(ids[i] > ids[i - 1]).toBe(true);
      }
    });
  });

  describe('ulid.isValid()', () => {
    it('should validate valid ULIDs', () => {
      expect(ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV')).toBe(true);
      expect(ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV'.toLowerCase())).toBe(true);
    });

    it('should reject invalid ULIDs', () => {
      expect(ulid.isValid('invalid')).toBe(false);
      expect(ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FA')).toBe(false); // Too short
      expect(ulid.isValid('01ARZ3NDEKTSV4RRFFQ69G5FAV0')).toBe(false); // Too long
      expect(ulid.isValid('')).toBe(false);
    });
  });

  describe('ulid.timestamp()', () => {
    it('should extract timestamp from ULID', () => {
      const before = Date.now();
      const id = ulid();
      const after = Date.now();

      const timestamp = ulid.timestamp(id);
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before);
      expect(timestamp.getTime()).toBeLessThanOrEqual(after);
    });

    it('should extract correct timestamp for ULID with custom time', () => {
      const ts = 1609459200000;
      const id = ulid({ timestamp: ts });
      const extracted = ulid.timestamp(id);
      expect(extracted.getTime()).toBe(ts);
    });
  });

  describe('uniqueness', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(ulid());
      }

      expect(ids.size).toBe(count);
    });
  });

  describe('Crockford Base32 encoding', () => {
    it('should not include confusing characters', () => {
      // Crockford Base32 excludes: I, L, O, U (confusing with 1, 1, 0, V)
      // Note: '0' (zero) IS included in Crockford Base32
      const confusing = ['I', 'L', 'O', 'U'];
      const id = ulid();

      for (const char of confusing) {
        expect(id).not.toContain(char);
      }
    });
  });
});
