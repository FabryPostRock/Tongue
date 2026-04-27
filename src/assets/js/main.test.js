import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import * as ss from './utilities.js';
import { getNewsBlock } from './main.js';
import { News } from './observable.js';
import { HackerNewsAPI } from './hacker_news_api.js';
// @vitest-environment jsdom

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
  kEnNewsUpdates: 'news:enNewsUpdates',
};

let n = null;

describe('getNewsBlock', () => {
  beforeEach(() => {
    n = new News();
    ss.safeStorage.clearStorage(sessionStorage);
    vi.unstubAllGlobals();
  });

  it('Check par KO : if one or more parameters are not correct an error is raised', async () => {
    await expect(
      getNewsBlock(n, {
        kItemsIds: null,
        kIdxStartId: STORAGE_NEWS.kIdxStartId,
        kEnNewsUpdates: STORAGE_NEWS.kEnNewsUpdates,
      }),
    ).rejects.toThrow();
    await expect(
      getNewsBlock(n, {
        kItemsIds: STORAGE_NEWS.kItemsIds,
        kIdxStartId: null,
        kEnNewsUpdates: STORAGE_NEWS.kEnNewsUpdates,
      }),
    ).rejects.toThrow();
    await expect(
      getNewsBlock(n, {
        kItemsIds: STORAGE_NEWS.kItemsIds,
        kIdxStartId: STORAGE_NEWS.kIdxStartId,
        kEnNewsUpdates: null,
      }),
    ).rejects.toThrow();
    await expect(getNewsBlock(Object, STORAGE_NEWS)).rejects.toThrowError(
      'One or more function parameters are not correct or missing!',
    );
  });

  it('kItemsIds.data type KO : Check kItemsIds.data not an array', async () => {
    const { kItemsIds, kIdxStartId, kEnNewsUpdates } = STORAGE_NEWS;
    const spyGetFrom = vi.spyOn(ss.safeStorage, 'getFrom').mockImplementation((storage, key) => {
      if (key === kItemsIds) {
        return {
          data: 'fake array',
          ok: true,
          status: 200,
          error: null,
        };
      }
      if (key === kEnNewsUpdates) {
        return false;
      }
      if (key === kIdxStartId) {
        return 0;
      }
      return null;
    });

    await expect(getNewsBlock(n, STORAGE_NEWS)).rejects.toThrowError('Could not retrive news Ids!');
  });

  it('enNewsUpdates OK : no errors if false or true', async () => {
    const { kItemsIds, kIdxStartId, kEnNewsUpdates } = STORAGE_NEWS;
    const spyGetFrom = vi.spyOn(ss.safeStorage, 'getFrom').mockImplementation((storage, key) => {
      if (key === kItemsIds) {
        return {
          data: Array.from({ length: 100 }, (_, i) => i + 1),
          ok: true,
          status: 200,
          error: null,
        };
      }
      if (key === kEnNewsUpdates) {
        return false;
      }
      if (key === kIdxStartId) {
        return 0;
      }
      return null;
    });

    vi.spyOn(n, 'subscribe').mockImplementation(() => {});
    vi.spyOn(n, 'addNews').mockImplementation(() => {});
    vi.spyOn(n, 'notify').mockImplementation(() => {});
    // se non faccio il mock qua fa la chiamata vera. Devo anche mockare l'oggetto restituito perchè
    // questo metodo lo restituisce.
    vi.spyOn(HackerNewsAPI, 'getBlockNewsDetails').mockResolvedValue({
      // l' item è mockato quindi può anche non essere corretto.
      data: { id: 47777174, by: 'fredrikaverpil' },
      ok: true,
      status: 200,
      error: null,
    });

    await expect(getNewsBlock(n, STORAGE_NEWS)).resolves.not.toThrow();
  });

  it('idxStartId OK : verify next start index ', async () => {
    const { kItemsIds, kIdxStartId, kEnNewsUpdates } = STORAGE_NEWS;
    const spyGetFrom = vi.spyOn(ss.safeStorage, 'getFrom').mockImplementation((storage, key) => {
      if (key === kItemsIds) {
        return {
          data: Array.from({ length: 50 }, (_, i) => i + 1),
          ok: true,
          status: 200,
          error: null,
        };
      }
      if (key === kEnNewsUpdates) {
        return false;
      }
      if (key === kIdxStartId) {
        return 30;
      }
      return null;
    });
    const expectedNewIdxEndId = 40;
    // finta implementazione di setTo dove non viene eseguito nulla
    const spySetTo = vi.spyOn(ss.safeStorage, 'setTo').mockImplementation(() => {});
    // finta implementazione di subscribe dove non viene eseguito nulla
    vi.spyOn(n, 'subscribe').mockImplementation(() => {});
    vi.spyOn(n, 'addNews').mockImplementation(() => {});
    vi.spyOn(n, 'notify').mockImplementation(() => {});
    // qui devo mockare la restituzione di un oggetto altrimenti il test non rispecchia il comportamento
    // reale del metodo
    vi.spyOn(HackerNewsAPI, 'getBlockNewsDetails').mockResolvedValue({
      data: { id: 1 },
      ok: true,
      status: 200,
      error: null,
    });

    await getNewsBlock(n, STORAGE_NEWS);
    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kIdxStartId, expectedNewIdxEndId);
  });

  it('idxEndId and enNewsUpdates last req. block OK  : idxEndId doesn t overflow and enNewsUpdates turned to true', async () => {
    const { kItemsIds, kIdxStartId, kEnNewsUpdates } = STORAGE_NEWS;
    const spyGetFrom = vi.spyOn(ss.safeStorage, 'getFrom').mockImplementation((storage, key) => {
      if (key === kItemsIds) {
        return {
          data: Array.from({ length: 50 }, (_, i) => i + 1),
          ok: true,
          status: 200,
          error: null,
        };
      }
      if (key === kEnNewsUpdates) {
        return false;
      }
      if (key === kIdxStartId) {
        return 42;
      }
      return null;
    });
    const expectedNewIdxEndId = 50;
    const expectedNewEnNewsUpdates = true;
    // finta implementazione di setTo dove non viene eseguito nulla
    const spySetTo = vi.spyOn(ss.safeStorage, 'setTo').mockImplementation(() => {});
    // finta implementazione di subscribe dove non viene eseguito nulla
    vi.spyOn(n, 'subscribe').mockImplementation(() => {});
    vi.spyOn(n, 'addNews').mockImplementation(() => {});
    vi.spyOn(n, 'notify').mockImplementation(() => {});
    // qui devo mockare la restituzione di un oggetto altrimenti il test non rispecchia il comportamento
    // reale del metodo
    vi.spyOn(HackerNewsAPI, 'getBlockNewsDetails').mockResolvedValue({
      data: { id: 3 },
      ok: true,
      status: 200,
      error: null,
    });

    await getNewsBlock(n, STORAGE_NEWS);

    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kIdxStartId, expectedNewIdxEndId);
    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kEnNewsUpdates, expectedNewEnNewsUpdates);
  });
});
