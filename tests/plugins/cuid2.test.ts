/**
 * Tests for CUID2 plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { cuid2Plugin } from '../../src/plugins/cuid2/index.js';
import type { Cuid2Api } from '../../src/plugins/cuid2/index.js';

describe('CUID2 Plugin', () => {
  let kernel: Kernel;
  let cuid2: Cuid2Api;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(cuid2Plugin);
    cuid2 = kernel.getApi<Cuid2Api>('cuid2')!;
  });

  describe('cuid2()', () => {
    it('should generate CUID2 with default length (24)', () => {
      const id = cuid2();
      expect(id.length).toBe(24);
    });

    it('should start with a letter', () => {
      expect(cuid2()).toMatch(/^[a-z]/);
    });

    it('should only contain base36 characters', () => {
      expect(cuid2()).toMatch(/^[a-z0-9]+$/i);
    });
  });

  describe('cuid2(options)', () => {
    it('should accept custom length', () => {
      const id = cuid2({ length: 32 });
      expect(id.length).toBe(32);
    });

    it('should use minimum length 24', () => {
      const id = cuid2({ length: 24 });
      expect(id.length).toBeGreaterThanOrEqual(24);
    });

    it('should use maximum length 32', () => {
      const id = cuid2({ length: 32 });
      expect(id.length).toBeLessThanOrEqual(32);
    });

    it('should accept custom fingerprint', () => {
      const id = cuid2({ fingerprint: 'test' });
      expect(id).toBeTruthy();
    });
  });

  describe('cuid2.isValid()', () => {
    it('should validate valid CUID2', () => {
      expect(cuid2.isValid('clh3am5yk0000qj1f8b9g2n7p')).toBe(true);
    });

    it('should reject invalid CUID2', () => {
      expect(cuid2.isValid('invalid')).toBe(false);
      expect(cuid2.isValid('')).toBe(false);
      expect(cuid2.isValid('0123456789')).toBe(false); // Doesn't start with letter
      expect(cuid2.isValid('a'.repeat(10))).toBe(false); // Too short
      expect(cuid2.isValid('a'.repeat(50))).toBe(false); // Too long
    });
  });

  describe('uniqueness', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(cuid2());
      }

      expect(ids.size).toBe(count);
    });
  });

  describe('format', () => {
    it('should be lowercase', () => {
      const id = cuid2();
      expect(id).toBe(id.toLowerCase());
    });
  });
});
