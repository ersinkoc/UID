/**
 * Tests for main index exports
 */

import { describe, it, expect } from 'vitest';
import { uid, createUid } from '../src/index.js';
import { uuidPlugin, ulidPlugin, nanoidPlugin } from '../src/plugins/index.js';

describe('Main Export', () => {
  describe('uid', () => {
    it('should be defined', () => {
      expect(uid).toBeDefined();
    });

    it('should have uuid method', () => {
      expect(uid.uuid).toBeDefined();
      expect(typeof uid.uuid).toBe('function');
    });

    it('should have ulid method', () => {
      expect(uid.ulid).toBeDefined();
      expect(typeof uid.ulid).toBe('function');
    });

    it('should have nanoid method', () => {
      expect(uid.nanoid).toBeDefined();
      expect(typeof uid.nanoid).toBe('function');
    });

    it('should have use method', () => {
      expect(uid.use).toBeDefined();
      expect(typeof uid.use).toBe('function');
    });

    it('should have list method', () => {
      expect(uid.list).toBeDefined();
      expect(typeof uid.list).toBe('function');
    });

    it('should have has method', () => {
      expect(uid.has).toBeDefined();
      expect(typeof uid.has).toBe('function');
    });

    it('should have unregister method', () => {
      expect(uid.unregister).toBeDefined();
      expect(typeof uid.unregister).toBe('function');
    });
  });

  describe('createUid', () => {
    it('should create a new UID instance', () => {
      const myUid = createUid();
      expect(myUid).toBeDefined();
      expect(myUid.uuid).toBeDefined();
    });

    it('should accept custom options', () => {
      const myUid = createUid({
        debug: true,
        random: (size) => new Uint8Array(size)
      });
      expect(myUid).toBeDefined();
    });
  });

  describe('default plugins', () => {
    it('should have core plugins loaded', () => {
      const plugins = uid.list();
      expect(plugins).toContain('uuid');
      expect(plugins).toContain('ulid');
      expect(plugins).toContain('nanoid');
    });
  });

  describe('uuid', () => {
    it('should generate UUID v4', () => {
      const id = uid.uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should have v4 method', () => {
      expect(uid.uuid.v4).toBeDefined();
    });

    it('should have v7 method', () => {
      expect(uid.uuid.v7).toBeDefined();
    });

    it('should have isValid method', () => {
      expect(uid.uuid.isValid).toBeDefined();
    });

    it('should have parse method', () => {
      expect(uid.uuid.parse).toBeDefined();
    });
  });

  describe('ulid', () => {
    it('should generate ULID', () => {
      const id = uid.ulid();
      expect(id).toMatch(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i);
    });

    it('should have monotonic method', () => {
      expect(uid.ulid.monotonic).toBeDefined();
    });

    it('should have isValid method', () => {
      expect(uid.ulid.isValid).toBeDefined();
    });

    it('should have timestamp method', () => {
      expect(uid.ulid.timestamp).toBeDefined();
    });
  });

  describe('nanoid', () => {
    it('should generate NanoID', () => {
      const id = uid.nanoid();
      expect(id.length).toBe(21);
    });

    it('should accept custom size', () => {
      const id = uid.nanoid(10);
      expect(id.length).toBe(10);
    });

    it('should have custom method', () => {
      expect(uid.nanoid.custom).toBeDefined();
    });

    it('should have urlSafe method', () => {
      expect(uid.nanoid.urlSafe).toBeDefined();
    });
  });

  describe('use/unregister', () => {
    it('should register optional plugin', () => {
      const pluginsBefore = uid.list().length;
      uid.use({ name: 'test', version: '1.0.0', install: () => {} });
      expect(uid.list().length).toBe(pluginsBefore + 1);
      uid.unregister('test');
      expect(uid.list().length).toBe(pluginsBefore);
    });
  });

  describe('plugin exports', () => {
    it('should export cuid2Plugin', () => {
      expect({ cuid2Plugin }).toBeDefined();
    });

    it('should export snowflakePlugin', () => {
      expect({ snowflakePlugin }).toBeDefined();
    });

    it('should export shortPlugin', () => {
      expect({ shortPlugin }).toBeDefined();
    });
  });
});
