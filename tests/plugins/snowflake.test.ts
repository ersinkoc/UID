/**
 * Tests for Snowflake plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { snowflakePlugin } from '../../src/plugins/snowflake/index.js';
import type { SnowflakeApi } from '../../src/plugins/snowflake/index.js';
import { UidError } from '../../src/types.js';

describe('Snowflake Plugin', () => {
  let kernel: Kernel;
  let snowflake: SnowflakeApi;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(snowflakePlugin);
    snowflake = kernel.getApi<SnowflakeApi>('snowflake')!;
  });

  describe('configure()', () => {
    it('should accept valid configuration', () => {
      expect(() => {
        snowflake.configure({ workerId: 1, datacenterId: 1 });
      }).not.toThrow();
    });

    it('should reject invalid workerId', () => {
      expect(() => {
        snowflake.configure({ workerId: -1, datacenterId: 1 });
      }).toThrow(UidError);

      expect(() => {
        snowflake.configure({ workerId: 32, datacenterId: 1 });
      }).toThrow(UidError);
    });

    it('should reject invalid datacenterId', () => {
      expect(() => {
        snowflake.configure({ workerId: 1, datacenterId: -1 });
      }).toThrow(UidError);

      expect(() => {
        snowflake.configure({ workerId: 1, datacenterId: 32 });
      }).toThrow(UidError);
    });

    it('should accept custom epoch', () => {
      expect(() => {
        snowflake.configure({
          workerId: 1,
          datacenterId: 1,
          epoch: 1609459200000
        });
      }).not.toThrow();
    });
  });

  describe('snowflake()', () => {
    beforeEach(() => {
      snowflake.configure({ workerId: 1, datacenterId: 1 });
    });

    it('should generate Snowflake ID', () => {
      const id = snowflake();
      expect(id).toMatch(/^\d+$/);
    });

    it('should generate numeric string', () => {
      const id = snowflake();
      expect(Number.isNaN(Number(id))).toBe(false);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(snowflake());
      }

      expect(ids.size).toBe(count);
    });

    it('should generate increasing IDs', () => {
      const ids: string[] = [];
      for (let i = 0; i < 10; i++) {
        ids.push(snowflake());
      }

      for (let i = 1; i < ids.length; i++) {
        expect(BigInt(ids[i]) > BigInt(ids[i - 1])).toBe(true);
      }
    });
  });

  describe('snowflake.bigint()', () => {
    beforeEach(() => {
      snowflake.configure({ workerId: 1, datacenterId: 1 });
    });

    it('should return BigInt', () => {
      const id = snowflake.bigint();
      expect(typeof id).toBe('bigint');
    });

    it('should be convertible to valid string', () => {
      const bigId = snowflake.bigint();
      const strVersion = bigId.toString();
      expect(strVersion).toMatch(/^\d+$/);
      expect(snowflake.isValid(strVersion)).toBe(true);
    });

    it('should generate unique bigints', () => {
      const ids = new Set<bigint>();
      for (let i = 0; i < 100; i++) {
        ids.add(snowflake.bigint());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('parse()', () => {
    beforeEach(() => {
      snowflake.configure({ workerId: 5, datacenterId: 3 });
    });

    it('should parse Snowflake ID', () => {
      const id = snowflake();
      const parsed = snowflake.parse(id);

      expect(parsed.workerId).toBe(5);
      expect(parsed.datacenterId).toBe(3);
      expect(parsed.sequence).toBeGreaterThanOrEqual(0);
      expect(parsed.sequence).toBeLessThanOrEqual(4095);
      expect(parsed.timestamp).toBeInstanceOf(Date);
    });

    it('should extract timestamp correctly', () => {
      const before = Date.now();
      const id = snowflake();
      const after = Date.now();

      const parsed = snowflake.parse(id);
      expect(parsed.timestamp.getTime()).toBeGreaterThanOrEqual(before);
      expect(parsed.timestamp.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('isValid()', () => {
    it('should validate valid Snowflake', () => {
      expect(snowflake.isValid('1234567890123456789')).toBe(true);
      expect(snowflake.isValid('1')).toBe(true);
    });

    it('should reject invalid Snowflake', () => {
      expect(snowflake.isValid('invalid')).toBe(false);
      expect(snowflake.isValid('')).toBe(false);
      expect(snowflake.isValid('12.34')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw when not configured', () => {
      const kernel2 = new Kernel();
      kernel2.use(snowflakePlugin);
      const sf = kernel2.getApi<SnowflakeApi>('snowflake')!;

      expect(() => sf()).toThrow(UidError);
      expect(() => sf.bigint()).toThrow(UidError);
    });
  });
});
