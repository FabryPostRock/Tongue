import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import * as ss from './utilities.js';
import {
  getNewsBlock,
  deleteSelNews,
  PAR_ERROR,
  NO_ID_SEL_NEWS_ERROR,
  SLIDE_IN_ERROR,
  NEWS_ITEMS_QUERY_ERROR,
} from './main.js';
import { News } from './observable.js';

import { HackerNewsAPI } from './hacker_news_api.js';
// @vitest-environment jsdom

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
  kEnNewsUpdates: 'news:enNewsUpdates',
};

const MOCKED_NEWS = [
  {
    data: {
      by: 'vinhnx',
      descendants: 0,
      id: 48232968,
      score: 1,
      time: 1779434248,
      title: "You can't whisper at an AI agent",
      type: 'story',
      url: 'https://stripe.dev/blog/ai-steering-experiments',
    },
    ok: true,
    status: 200,
    error: null,
  },

  {
    data: {
      by: 'rendx',
      descendants: 0,
      id: 48232977,
      score: 1,
      time: 1779434330,
      title: 'The Inheritance of Survival',
      type: 'story',
      url: 'https://brandypigeon.substack.com/p/the-inheritance-of-survival',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'visark_42',
      descendants: 0,
      id: 48232952,
      kids: [48232953],
      score: 2,
      time: 1779434146,
      title: 'Matching Principle: Adversarial, augmentation, etc. are estimators of one matrix',
      type: 'story',
      url: 'https://arxiv.org/abs/2605.22800',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'joozio',
      descendants: 0,
      id: 48232928,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: '01-_-',
      descendants: 0,
      id: 48232976,
      score: 1,
      time: 1779434326,
      title: 'Acrisure layoffs to number 2,250, attributed to AI advancements',
      type: 'story',
      url: 'https://www.detroitnews.com/story/business/2026/05/20/grand-rapids-acrisure-to-cut-2250-jobs-cites-ai/90183575007/https://www.detroitnews.com/story/business/2026/05/20/grand-rapids-acrisure-to-cut-2250-jobs-cites-ai/90183575007/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'a',
      descendants: 0,
      id: 48232929,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'b',
      descendants: 0,
      id: 48232930,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'c',
      descendants: 0,
      id: 48232931,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'd',
      descendants: 0,
      id: 48232932,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
  {
    data: {
      by: 'e',
      descendants: 0,
      id: 48232933,
      score: 1,
      time: 1779433800,
      title: 'Roundtables: Can AI Learn to Understand the World?',
      type: 'story',
      url: 'https://www.technologyreview.com/2026/05/21/1137756/roundtables-can-ai-learn-to-understand-the-world/',
    },
    ok: true,
    status: 200,
    error: null,
  },
];
let n = null;
let renderNewsChange;
let parentNode;
let elements;
let intObs;
const { kItemsIds, kIdxStartId, kEnNewsUpdates } = STORAGE_NEWS;

beforeEach(async () => {
  /* 
  NOTE
  La libreria JSDOM non costruisce da sola il DOM perciò devo caricare a mano il minimo indispensabile per il test.
  E' fondamentale che il DOM esista prima che venga istanziato 'parentNode' dentro observers.js
  */
  document.body.innerHTML = `<div id="news-container"></div>`;
  ({ renderNewsChange, parentNode, elements, intObs } = await import('./observers.js'));
});

describe('getNewsBlock', () => {
  beforeEach(async () => {
    n = new News();
    ss.safeStorage.clearStorage(sessionStorage);
  });

  it('Check par KO : if one or more parameters are not correct an error is raised', async () => {
    await expect(
      getNewsBlock(
        n,
        {
          kItemsIds: null,
          kIdxStartId: STORAGE_NEWS.kIdxStartId,
          kEnNewsUpdates: STORAGE_NEWS.kEnNewsUpdates,
        },
        renderNewsChange,
      ),
    ).rejects.toThrowError(PAR_ERROR);
    await expect(
      getNewsBlock(
        n,
        {
          kItemsIds: STORAGE_NEWS.kItemsIds,
          kIdxStartId: null,
          kEnNewsUpdates: STORAGE_NEWS.kEnNewsUpdates,
        },
        renderNewsChange,
      ),
    ).rejects.toThrowError(PAR_ERROR);
    await expect(
      getNewsBlock(
        n,
        {
          kItemsIds: STORAGE_NEWS.kItemsIds,
          kIdxStartId: STORAGE_NEWS.kIdxStartId,
          kEnNewsUpdates: null,
        },
        renderNewsChange,
      ),
    ).rejects.toThrowError(PAR_ERROR);
    await expect(
      getNewsBlock(
        n,
        {
          kItemsIds: STORAGE_NEWS.kItemsIds,
          kIdxStartId: STORAGE_NEWS.kIdxStartId,
          kEnNewsUpdates: STORAGE_NEWS.kEnNewsUpdates,
        },
        'wrong function passed',
      ),
    ).rejects.toThrowError(PAR_ERROR);
    await expect(getNewsBlock(Object, STORAGE_NEWS, renderNewsChange)).rejects.toThrowError(PAR_ERROR);
  });

  it('kItemsIds.data type KO : Check kItemsIds.data not an array', async () => {
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

    await expect(getNewsBlock(n, STORAGE_NEWS, renderNewsChange)).rejects.toThrowError('Could not retrive news Ids!');
  });

  it('enNewsUpdates OK : no errors if false or true', async () => {
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

    await expect(getNewsBlock(n, STORAGE_NEWS, renderNewsChange)).resolves.not.toThrow();
  });

  it('idxStartId OK : verify next start index ', async () => {
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

    await getNewsBlock(n, STORAGE_NEWS, renderNewsChange);
    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kIdxStartId, expectedNewIdxEndId);
  });

  it('idxEndId and enNewsUpdates last req. block OK  : idxEndId doesn t overflow and enNewsUpdates turned to true', async () => {
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

    await getNewsBlock(n, STORAGE_NEWS, renderNewsChange);

    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kIdxStartId, expectedNewIdxEndId);
    expect(spySetTo).toHaveBeenCalledWith(sessionStorage, kEnNewsUpdates, expectedNewEnNewsUpdates);
  });
});

describe('deleteSelNews', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    n = new News();
  });

  it('par KO ', () => {
    expect(() => deleteSelNews(Object)).toThrowError(PAR_ERROR);
  });

  it('par OK but dataNewsIds.length = 0', () => {
    expect(() => deleteSelNews(n)).toThrowError(NEWS_ITEMS_QUERY_ERROR);
  });

  it('News render OK : news created and found in the DOM', async () => {
    n.subscribe(renderNewsChange);

    n.addNews({
      id: 1,
      by: 'Bob',
      score: 10,
      time: 1776249464,
      title: 'Title',
      type: 'story',
      url: 'https://example.com',
    });

    expect(n.items.has(1)).toBe(true);
    expect(document.querySelectorAll('div[data-news-id]').length).toBe(1);
  });

  it('News delete OK : News created and deleted in the DOM and in the Observable class ', async () => {
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
        return 0;
      }
      return null;
    });

    const { renderNewsChange, parentNode, elements, intObs } = await import('./observers.js');
    let idx = 0;
    // Mocko la restituzione di n elementi creati a mano. id++ itera sugli elementi dell'array
    const getBlockSpy = vi
      .spyOn(HackerNewsAPI, 'getBlockNewsDetails')
      .mockImplementation(async () => MOCKED_NEWS[idx++]);
    await getNewsBlock(n, STORAGE_NEWS, renderNewsChange);
    expect(n.items.size).toBeGreaterThan(0);
    expect(document.querySelector('#news-container')).not.toBeNull();
    expect(document.querySelectorAll('div[data-news-id]').length).toBeGreaterThan(0);
    deleteSelNews(n);
    for (let idxClicked = 0; idxClicked < 10; idxClicked++) {
      // simula il click sulla card
      const card = document.querySelector(`[data-news-id="${MOCKED_NEWS[idxClicked].data.id}"]`);
      card.click();
      // il listener è async perchè 'el.addEventListener('click', async () =>...', quindi attendiamo l'esecuzione della Promise.
      await Promise.resolve();
      // la news è stata rimossa dalla mappa
      expect(n.items.has(MOCKED_NEWS[idxClicked].data.id)).toBe(false);
      // la card è stata davvero rimossa dal DOM
      expect(document.querySelector(`[data-news-id="${MOCKED_NEWS[idxClicked].data.id}"]`)).toBeNull();
    }
  });
});
