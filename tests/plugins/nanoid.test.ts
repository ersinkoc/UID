/**
 * Tests for NanoID plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { nanoidPlugin } from '../../src/plugins/nanoid/index.js';
import type { NanoidApi } from '../../src/plugins/nanoid/index.js';

describe('NanoID Plugin', () => {
  let kernel: Kernel;
  let nanoid: NanoidApi;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(nanoidPlugin);
    nanoid = kernel.getApi<NanoidApi>('nanoid')!;
  });

  describe('nanoid()', () => {
    it('should generate NanoID with default size (21)', () => {
      const id = nanoid();
      expect(id.length).toBe(21);
    });

    it('should use URL-safe characters', () => {
      const id = nanoid();
      expect(id).toMatch(/^[-_0-9A-Za-z]+$/);
    });
  });

  describe('nanoid(size)', () => {
    it('should generate NanoID with custom size', () => {
      const id = nanoid(10);
      expect(id.length).toBe(10);
    });

    it('should generate size 1', () => {
      const id = nanoid(1);
      expect(id.length).toBe(1);
    });

    it('should generate size 100', () => {
      const id = nanoid(100);
      expect(id.length).toBe(100);
    });
  });

  describe('nanoid.custom()', () => {
    it('should use custom alphabet', () => {
      const id = nanoid.custom({ alphabet: 'abc123', size: 10 });
      expect(id.length).toBe(10);
      expect(id).toMatch(/^[abc123]+$/);
    });

    it('should use default size when not specified', () => {
      const id = nanoid.custom({ alphabet: 'abc123' });
      expect(id.length).toBe(21);
    });

    it('should use default alphabet when not specified', () => {
      const id = nanoid.custom({ size: 10 });
      expect(id.length).toBe(10);
    });
  });

  describe('nanoid.urlSafe()', () => {
    it('should generate URL-safe ID', () => {
      const id = nanoid.urlSafe();
      expect(id).toMatch(/^[-_0-9A-Za-z]+$/);
    });

    it('should use custom size', () => {
      const id = nanoid.urlSafe(12);
      expect(id.length).toBe(12);
    });
  });

  describe('uniqueness', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(nanoid());
      }

      expect(ids.size).toBe(count);
    });

    it('should generate unique IDs with custom alphabet', () => {
      const ids = new Set<string>();
      const count = 100;

      for (let i = 0; i < count; i++) {
        ids.add(nanoid.custom({ alphabet: 'abc', size: 10 }));
      }

      expect(ids.size).toBe(count);
    });
  });

  describe('uniformity', () => {
    it('should have uniform distribution', () => {
      const counts: Record<string, number> = {};
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const id = nanoid.custom({ alphabet: 'abc', size: 1 });
        counts[id] = (counts[id] || 0) + 1;
      }

      // Each character should appear roughly 1/3 of the time
      for (const char of 'abc') {
        expect(counts[char]).toBeGreaterThan(2000);
        expect(counts[char]).toBeLessThan(4000);
      }
    });
  });
});
