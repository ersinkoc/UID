/**
 * Tests for the kernel
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Kernel } from '../../src/kernel/kernel.js';
import type { UidPlugin, UidContext } from '../../src/types.js';

describe('Kernel', () => {
  let kernel: Kernel;

  beforeEach(() => {
    kernel = new Kernel();
  });

  describe('constructor', () => {
    it('should create a new kernel instance', () => {
      expect(kernel).toBeInstanceOf(Kernel);
      expect(kernel.list()).toEqual([]);
    });

    it('should accept custom random source', () => {
      const customKernel = new Kernel({
        random: (size) => new Uint8Array(size)
      });
      expect(customKernel).toBeInstanceOf(Kernel);
    });

    it('should accept debug option', () => {
      const debugKernel = new Kernel({ debug: true });
      expect(debugKernel).toBeInstanceOf(Kernel);
    });
  });

  describe('use', () => {
    it('should register a plugin', () => {
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: (k) => {
          k.registerApi('test', () => 'test');
        }
      };

      kernel.use(plugin);
      expect(kernel.list()).toContain('test');
      expect(kernel.has('test')).toBe(true);
    });

    it('should call plugin install', () => {
      let installed = false;
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: () => {
          installed = true;
        }
      };

      kernel.use(plugin);
      expect(installed).toBe(true);
    });

    it('should not register duplicate plugin', () => {
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: () => {}
      };

      kernel.use(plugin);
      kernel.use(plugin);
      expect(kernel.list().filter((n) => n === 'test')).toHaveLength(1);
    });

    it('should check dependencies', () => {
      const pluginWithDep: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        dependencies: ['missing'],
        install: () => {}
      };

      expect(() => kernel.use(pluginWithDep)).toThrow();
    });
  });

  describe('unregister', () => {
    it('should unregister a plugin', () => {
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: (k) => {
          k.registerApi('test', () => 'test');
        }
      };

      kernel.use(plugin);
      expect(kernel.unregister('test')).toBe(true);
      expect(kernel.has('test')).toBe(false);
    });

    it('should return false for non-existent plugin', () => {
      expect(kernel.unregister('nonexistent')).toBe(false);
    });

    it('should call onDestroy if present', () => {
      let destroyed = false;
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: () => {},
        onDestroy: () => {
          destroyed = true;
        }
      };

      kernel.use(plugin);
      kernel.unregister('test');
      expect(destroyed).toBe(true);
    });
  });

  describe('list', () => {
    it('should return empty array initially', () => {
      expect(kernel.list()).toEqual([]);
    });

    it('should list all registered plugins', () => {
      const plugin1: UidPlugin = {
        name: 'test1',
        version: '1.0.0',
        install: () => {}
      };
      const plugin2: UidPlugin = {
        name: 'test2',
        version: '1.0.0',
        install: () => {}
      };

      kernel.use(plugin1);
      kernel.use(plugin2);

      const list = kernel.list();
      expect(list).toContain('test1');
      expect(list).toContain('test2');
    });
  });

  describe('has', () => {
    it('should return false for non-existent plugin', () => {
      expect(kernel.has('test')).toBe(false);
    });

    it('should return true for registered plugin', () => {
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: () => {}
      };

      kernel.use(plugin);
      expect(kernel.has('test')).toBe(true);
    });
  });

  describe('random', () => {
    it('should generate random bytes', () => {
      const bytes = kernel.random(16);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });

    it('should generate different values', () => {
      const bytes1 = kernel.random(16);
      const bytes2 = kernel.random(16);
      expect(Array.from(bytes1)).not.toEqual(Array.from(bytes2));
    });
  });

  describe('registerApi', () => {
    it('should register an API', () => {
      const api = { test: () => 'value' };
      kernel.registerApi('test', api);

      expect(kernel.getApi('test')).toBe(api);
    });
  });

  describe('getApi', () => {
    it('should return registered API', () => {
      const api = { test: () => 'value' };
      kernel.registerApi('test', api);

      expect(kernel.getApi('test')).toBe(api);
    });

    it('should return undefined for non-existent API', () => {
      expect(kernel.getApi('nonexistent')).toBeUndefined();
    });
  });

  describe('getContext', () => {
    it('should return context object', () => {
      const context = kernel.getContext();
      expect(context).toBeDefined();
      expect(context.config).toBeInstanceOf(Map);
      expect(context.hooks).toBeInstanceOf(Map);
    });
  });

  describe('init', () => {
    it('should call onInit for all plugins', async () => {
      let inited1 = false;
      let inited2 = false;

      const plugin1: UidPlugin = {
        name: 'test1',
        version: '1.0.0',
        install: () => {},
        onInit: () => {
          inited1 = true;
        }
      };

      const plugin2: UidPlugin = {
        name: 'test2',
        version: '1.0.0',
        install: () => {},
        onInit: () => {
          inited2 = true;
        }
      };

      kernel.use(plugin1);
      kernel.use(plugin2);

      await kernel.init();

      expect(inited1).toBe(true);
      expect(inited2).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should call onDestroy for all plugins', async () => {
      let destroyed1 = false;
      let destroyed2 = false;

      const plugin1: UidPlugin = {
        name: 'test1',
        version: '1.0.0',
        install: () => {},
        onDestroy: () => {
          destroyed1 = true;
        }
      };

      const plugin2: UidPlugin = {
        name: 'test2',
        version: '1.0.0',
        install: () => {},
        onDestroy: () => {
          destroyed2 = true;
        }
      };

      kernel.use(plugin1);
      kernel.use(plugin2);

      await kernel.destroy();

      expect(destroyed1).toBe(true);
      expect(destroyed2).toBe(true);
    });

    it('should clear plugins and APIs', async () => {
      const plugin: UidPlugin = {
        name: 'test',
        version: '1.0.0',
        install: (k) => {
          k.registerApi('test', () => 'value');
        }
      };

      kernel.use(plugin);
      await kernel.destroy();

      expect(kernel.list()).toEqual([]);
      expect(kernel.getApi('test')).toBeUndefined();
    });
  });
});
