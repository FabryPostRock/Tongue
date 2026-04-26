import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import * as ss from './utilities.js';
// @vitest-environment jsdom

describe('sessionStorage', () => {
  afterEach(() => {
    ss.safeStorage.clearStorage(sessionStorage);
    vi.unstubAllGlobals();
  });

  it('getFrom and setTo OK : Check stringify and parsing without exceptions and parameters in the call', async () => {
    const spySetTo = vi.spyOn(ss.safeStorage, 'setTo');
    const spyGetFrom = vi.spyOn(ss.safeStorage, 'getFrom');
    const kStorage = 'test:element';
    const vStorage = { k1: 12312, k2: 'fake text', k3: [1, 65, 78, 93], k4: null };

    await expect(async () => await ss.safeStorage.setTo(sessionStorage, kStorage, vStorage)).not.toThrow();
    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kStorage, vStorage);
    expect(() => ss.safeStorage.getFrom(sessionStorage, kStorage)).not.toThrow();
    expect(spyGetFrom).toHaveBeenCalledWith(sessionStorage, kStorage);
  });

  it('getFrom OK : Check the returned values from getFrom', async () => {
    const kStorage = 'test:element';
    const vStorage = { k1: 43242, k2: 'bla bla bla', k3: [423143244, 546546, 1, 65, 78, 93] };
    await ss.safeStorage.setTo(sessionStorage, kStorage, vStorage);
    const resGetFrom = ss.safeStorage.getFrom(sessionStorage, kStorage);
    expect(resGetFrom).toStrictEqual(vStorage);
  });

  it('getFrom and setTo JSON KO : Checks Exception errors due to JSON.stringify and JSON.parse', async () => {
    const errParse = 'SyntaxError: Unexpected non-whitespace character after JSON at position 2 (line 1 column 3)';
    const errStringify = 'Uncaught TypeError TypeError: Do not know how to serialize a BigInt';
    vi.stubGlobal('JSON', {
      ...globalThis.JSON,
      parse: vi.fn(() => {
        throw new SyntaxError(`el parsing has generated an error : ${errParse}`);
      }),
      stringify: vi.fn(() => {
        throw new SyntaxError(`el stringification has generated an error : ${errStringify}`);
      }),
    });

    const kStorage = 'test:element';
    const vStorage = { x: BigInt('9007199254740992') };
    // .rejects perchè è una Promise
    await expect(ss.safeStorage.setTo(sessionStorage, kStorage, vStorage)).rejects.toThrowError(
      `el stringification has generated an error : ${errStringify}`,
    );
    // scrivo un valore errato
    sessionStorage.setItem(kStorage, '10@');
    expect(() => ss.safeStorage.getFrom(sessionStorage, kStorage)).toThrowError(
      `el parsing has generated an error : ${errParse}`,
    );
  });

  it('getFrom, clearStorage and setTo KO : Throws error if one or more parameters are missing', async () => {
    const kStorage = 'test:element';
    const vStorage = { a: 'b' };

    await expect(async () => await ss.safeStorage.setTo(null, kStorage, vStorage)).rejects.toThrow();
    await expect(async () => await ss.safeStorage.setTo(sessionStorage, null, vStorage)).rejects.toThrow();
    await expect(async () => await ss.safeStorage.setTo(sessionStorage, kStorage, null)).rejects.toThrow();

    expect(() => ss.safeStorage.getFrom(sessionStorage, null)).toThrow();
    expect(() => ss.safeStorage.getFrom(null, kStorage)).toThrow();

    expect(() => ss.safeStorage.clearStorage(null)).toThrow();
  });
});
