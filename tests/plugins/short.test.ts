/**
 * Tests for Short ID plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { shortPlugin } from '../../src/plugins/short/index.js';
import type { ShortApi } from '../../src/plugins/short/index.js';

describe('Short ID Plugin', () => {
  let kernel: Kernel;
  let short: ShortApi;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(shortPlugin);
    short = kernel.getApi<ShortApi>('short')!;
  });

  describe('short()', () => {
    it('should generate ID with default size (11)', () => {
      const id = short();
      expect(id.length).toBe(11);
    });

    it('should use Base58 by default', () => {
      const id = short();
      // Base58 excludes: 0, O, I, l
      expect(id).not.toMatch(/[0OIl]/);
    });
  });

  describe('short(size)', () => {
    it('should generate ID with custom size', () => {
      const id = short(8);
      expect(id.length).toBe(8);
    });

    it('should generate size 1', () => {
      const id = short(1);
      expect(id.length).toBe(1);
    });

    it('should generate size 100', () => {
      const id = short(100);
      expect(id.length).toBe(100);
    });
  });

  describe('short.youtube()', () => {
    it('should generate YouTube-style ID (11 chars)', () => {
      const id = short.youtube();
      expect(id.length).toBe(11);
    });

    it('should use Base64 URL-safe alphabet', () => {
      const id = short.youtube();
      expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });

  describe('short.base62()', () => {
    it('should generate Base62 ID with default size (10)', () => {
      const id = short.base62();
      expect(id.length).toBe(10);
    });

    it('should use custom size', () => {
      const id = short.base62(15);
      expect(id.length).toBe(15);
    });

    it('should use alphanumeric characters only', () => {
      const id = short.base62();
      expect(id).toMatch(/^[0-9A-Za-z]+$/);
    });
  });

  describe('short.base58()', () => {
    it('should generate Base58 ID with default size (8)', () => {
      const id = short.base58();
      expect(id.length).toBe(8);
    });

    it('should use custom size', () => {
      const id = short.base58(12);
      expect(id.length).toBe(12);
    });

    it('should exclude confusing characters', () => {
      const id = short.base58();
      expect(id).not.toMatch(/[0OIl]/);
    });
  });

  describe('uniqueness', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(short());
      }

      expect(ids.size).toBe(count);
    });
  });
});
