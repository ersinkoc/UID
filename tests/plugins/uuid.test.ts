/**
 * Tests for UUID plugin
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import { uuidPlugin } from '../../src/plugins/uuid/index.js';
import type { UuidApi } from '../../src/plugins/uuid/index.js';

describe('UUID Plugin', () => {
  let kernel: Kernel;
  let uuid: UuidApi;

  beforeEach(() => {
    kernel = new Kernel();
    kernel.use(uuidPlugin);
    uuid = kernel.getApi<UuidApi>('uuid')!;
  });

  describe('uuid()', () => {
    it('should generate UUID v4 by default', () => {
      const id = uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate different values', () => {
      const id1 = uuid();
      const id2 = uuid();
      expect(id1).not.toBe(id2);
    });
  });

  describe('uuid.v4()', () => {
    it('should generate valid UUID v4', () => {
      const id = uuid.v4();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should have version 4', () => {
      const id = uuid.v4();
      const parsed = uuid.parse(id);
      expect(parsed?.version).toBe(4);
    });

    it('should have RFC4122 variant', () => {
      const id = uuid.v4();
      const parsed = uuid.parse(id);
      expect(parsed?.variant).toBe('RFC4122');
    });
  });

  describe('uuid.v7()', () => {
    it('should generate valid UUID v7', () => {
      const id = uuid.v7();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should have version 7', () => {
      const id = uuid.v7();
      const parsed = uuid.parse(id);
      expect(parsed?.version).toBe(7);
    });

    it('should accept custom timestamp', () => {
      const timestamp = 1609459200000; // 2021-01-01
      const id = uuid.v7({ timestamp });
      const parsed = uuid.parse(id);
      expect(parsed?.timestamp).toBeDefined();
      expect(parsed?.timestamp!.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('uuid.isValid()', () => {
    it('should validate valid UUIDs', () => {
      expect(uuid.isValid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(uuid.isValid('018f3b3c-8d1a-7def-8a3b-1c2d3e4f5a6b')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(uuid.isValid('invalid')).toBe(false);
      expect(uuid.isValid('550e8400-e29b-41d4-a716')).toBe(false);
      expect(uuid.isValid('')).toBe(false);
      expect(uuid.isValid('g50e8400-e29b-41d4-a716-446655440000')).toBe(false);
    });
  });

  describe('uuid.parse()', () => {
    it('should parse UUID v4', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const parsed = uuid.parse(id);

      expect(parsed).toBeDefined();
      expect(parsed!.version).toBe(4);
      expect(parsed!.variant).toBe('RFC4122');
      expect(parsed!.bytes).toBeInstanceOf(Uint8Array);
      expect(parsed!.bytes.length).toBe(16);
    });

    it('should parse UUID v7', () => {
      const id = uuid.v7();
      const parsed = uuid.parse(id);

      expect(parsed).toBeDefined();
      expect(parsed!.version).toBe(7);
      expect(parsed!.timestamp).toBeInstanceOf(Date);
    });

    it('should return null for invalid UUID', () => {
      expect(uuid.parse('invalid')).toBeNull();
    });
  });

  describe('timestamp extraction', () => {
    it('should extract timestamp from v7', () => {
      const before = Date.now();
      const id = uuid.v7();
      const after = Date.now();

      const parsed = uuid.parse(id);
      const timestamp = parsed!.timestamp!;

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before);
      expect(timestamp.getTime()).toBeLessThanOrEqual(after);
    });

    it('should not have timestamp for v4', () => {
      const id = uuid.v4();
      const parsed = uuid.parse(id);

      expect(parsed!.timestamp).toBeUndefined();
    });
  });

  describe('uniqueness', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(uuid.v4());
      }

      expect(ids.size).toBe(count);
    });
  });
});
