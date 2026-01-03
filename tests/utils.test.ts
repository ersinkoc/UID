/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  byteToHex,
  hexToByte,
  numberToBytes,
  bytesToNumber,
  validateAlphabet,
  validateSize,
  createValidator,
  toHex,
  fromHex,
  encodeBase,
  decodeBase,
  UidError
} from '../src/utils.js';

describe('byteToHex', () => {
  it('should convert byte to hex string', () => {
    expect(byteToHex(0)).toBe('00');
    expect(byteToHex(255)).toBe('ff');
    expect(byteToHex(16)).toBe('10');
    expect(byteToHex(0xab)).toBe('ab');
  });
});

describe('hexToByte', () => {
  it('should convert hex to byte', () => {
    expect(hexToByte('00')).toBe(0);
    expect(hexToByte('ff')).toBe(255);
    expect(hexToByte('10')).toBe(16);
    expect(hexToByte('ab')).toBe(171);
  });
});

describe('numberToBytes', () => {
  it('should convert number to bytes', () => {
    expect(Array.from(numberToBytes(0n, 2))).toEqual([0, 0]);
    expect(Array.from(numberToBytes(255n, 2))).toEqual([0, 255]);
    expect(Array.from(numberToBytes(0x1234n, 2))).toEqual([18, 52]);
    expect(Array.from(numberToBytes(0xffffffffn, 4))).toEqual([255, 255, 255, 255]);
  });
});

describe('bytesToNumber', () => {
  it('should convert bytes to number', () => {
    expect(bytesToNumber(new Uint8Array([0, 0]))).toBe(0n);
    expect(bytesToNumber(new Uint8Array([0, 255]))).toBe(255n);
    expect(bytesToNumber(new Uint8Array([18, 52]))).toBe(4692n);
    expect(bytesToNumber(new Uint8Array([1, 0, 0]))).toBe(65536n);
  });
});

describe('validateAlphabet', () => {
  it('should accept valid alphabets', () => {
    expect(() => validateAlphabet('ab')).not.toThrow();
    expect(() => validateAlphabet('abc123')).not.toThrow();
    expect(() => validateAlphabet('0123456789abcdef')).not.toThrow();
  });

  it('should reject alphabet with duplicates', () => {
    expect(() => validateAlphabet('aa')).toThrowError(UidError);
    expect(() => validateAlphabet('abcda')).toThrowError(UidError);
  });

  it('should reject alphabet that is too short', () => {
    expect(() => validateAlphabet('a')).toThrowError(UidError);
    expect(() => validateAlphabet('')).toThrowError(UidError);
  });
});

describe('validateSize', () => {
  it('should accept valid sizes', () => {
    expect(() => validateSize(5, 1, 10)).not.toThrow();
    expect(() => validateSize(1, 1, 10)).not.toThrow();
    expect(() => validateSize(10, 1, 10)).not.toThrow();
  });

  it('should reject size out of range', () => {
    expect(() => validateSize(0, 1, 10)).toThrowError(UidError);
    expect(() => validateSize(11, 1, 10)).toThrowError(UidError);
    expect(() => validateSize(-1, 1, 10)).toThrowError(UidError);
  });

  it('should reject non-integer size', () => {
    expect(() => validateSize(1.5, 1, 10)).toThrowError(UidError);
  });
});

describe('createValidator', () => {
  it('should create a validator function', () => {
    const isHex = createValidator(/^[0-9a-f]+$/);
    expect(isHex('abc123')).toBe(true);
    expect(isHex('xyz')).toBe(false);
    expect(isHex('')).toBe(false);
  });
});

describe('toHex', () => {
  it('should convert bytes to hex string', () => {
    expect(toHex(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))).toBe('deadbeef');
    expect(toHex(new Uint8Array([0, 1, 2]))).toBe('000102');
    expect(toHex(new Uint8Array([]))).toBe('');
  });
});

describe('fromHex', () => {
  it('should convert hex string to bytes', () => {
    expect(Array.from(fromHex('deadbeef'))).toEqual([0xde, 0xad, 0xbe, 0xef]);
    expect(Array.from(fromHex('000102'))).toEqual([0, 1, 2]);
  });

  it('should handle uppercase hex', () => {
    expect(Array.from(fromHex('DEADBEEF'))).toEqual([0xde, 0xad, 0xbe, 0xef]);
  });
});

describe('encodeBase', () => {
  it('should encode bytes using alphabet', () => {
    const result = encodeBase(new Uint8Array([0, 1, 2]), 'abc');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should encode zero bytes as empty string', () => {
    expect(encodeBase(new Uint8Array([]), 'abc')).toBe('');
  });

  it('should validate alphabet', () => {
    expect(() => encodeBase(new Uint8Array([0]), 'a')).toThrowError(UidError);
    expect(() => encodeBase(new Uint8Array([0]), 'aa')).toThrowError(UidError);
  });
});

describe('decodeBase', () => {
  it('should decode string to bytes', () => {
    const result = decodeBase('aaa', 'abc');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should validate alphabet', () => {
    expect(() => decodeBase('x', 'abc')).toThrowError(UidError);
  });
});

describe('round-trip encoding/decoding', () => {
  it('should survive round-trip', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    const alphabet = '0123456789abcdef';
    const encoded = encodeBase(bytes, alphabet);
    const decoded = decodeBase(encoded, alphabet);
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });
});
