import * as HN from './hacker_news_api.js';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('HackerNewsAPI-Get-Ids', () => {
  // se stai usando la libreria 'axios' devi mockare quella, se moki 'fetch' il test fallisce.

  it('Verifica url e tipo risultato della chiamata in caso di api call status tra 200 e 399', async () => {
    const result = {
      data: [1, 2, 3, 4, 5],
      ok: true,
      status: 200,
      error: null,
    };
    // mockResolvedValueOnce : testa la parte del try
    axios.get.mockResolvedValueOnce(result);
    const url = 'https://hacker-news.firebaseio.com/v0/newstories.json';
    const res = await HN.HackerNewsAPI.getAllNewsIDs(url);
    expect(axios.get).toHaveBeenCalledWith(url);
    expect(HN.HackerNewsAPI.itemsIds.URL).toEqual(url);
    expect(res).toEqual(result);
    //devo resettare le varibili di classe perchè il suo 'state' non si resetta con un nuovo test
    HN.HackerNewsAPI.reset();
  });
  it('Verifica keys and values del risultato della call', async () => {
    const result = {
      data: [1, 2, 3, 4, 5],
      ok: true,
      status: 200,
      error: null,
    };
    const axiosRes = {
      status: result.status,
      data: result.data,
    };
    // se usi la libreria axios devi usare 'axios.get.' non 'fetch' e json: () => Promise.resolve(result)
    axios.get.mockResolvedValueOnce(axiosRes);
    const url = 'https://hacker-news.firebaseio.com/v0/newstories.json';
    const res = await HN.HackerNewsAPI.getAllNewsIDs(url);
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('ok');
    expect(res).toHaveProperty('status');
    expect(res).toHaveProperty('error');
    expect(Object.getPrototypeOf(res.data)).toEqual(Array.prototype);
    expect(Object.getPrototypeOf(res.ok)).toEqual(Boolean.prototype);
    expect(res.ok).toBe(true);
    expect(Object.getPrototypeOf(res.status)).toEqual(Number.prototype);
    expect(res.error).toBeNull();

    HN.HackerNewsAPI.reset();
  });

  it('Verifica risposta in caso di errore', async () => {
    const result = {
      data: null,
      ok: false,
      status: 400,
      error: 'Bad request',
    };
    const axiosError = {
      response: {
        status: result.status,
        data: {
          error: result.error,
        },
      },
    };
    // mockRejectedValue : testa la parte del catch
    axios.get.mockRejectedValue(axiosError);
    const url = 'https://hacker-news.firebaseio.com/v0/newstories.json';
    const res = await HN.HackerNewsAPI.getAllNewsIDs(url);
    expect(axios.get).toHaveBeenCalledTimes(HN.HackerNewsAPI.itemsIds_MAX_RETRIES);
    expect(res.data).toBeNull();
    expect(res.ok).toBe(false);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(Object.getPrototypeOf(res.error)).toEqual(String.prototype);
    HN.HackerNewsAPI.reset();
  });
});

describe(' HN.HackerNewsAPI-Get-item Details', () => {
  it('Verifica url e tipo risultato della chiamata in caso di api call status tra 200 e 399', async () => {
    const result = {
      data: { Object },
      ok: true,
      status: 200,
      error: null,
    };
    const id = 47777174;
    // mockResolvedValueOnce : testa la parte del try
    axios.get.mockResolvedValueOnce(result);
    let url = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    const res = await HN.HackerNewsAPI.getBlockNewsDetails(id);
    expect(axios.get).toHaveBeenCalledWith(url(id));
    expect(HN.HackerNewsAPI.itemDetails.URL(id)).toEqual(url(id));
    expect(res).toEqual(result);
    //devo resettare le varibili di classe perchè il suo 'state' non si resetta con un nuovo test
    HN.HackerNewsAPI.reset();
  });
  it('Verifica keys and values del risultato della call', async () => {
    const result = {
      data: {
        by: 'dhouston',
        descendants: 71,
        id: 8863,
        kids: [8952, 8878, 8870, 8980, 8934, 8876],
        score: 111,
        time: 1175714200,
        title: 'My YC app: Dropbox - Throw away your USB drive',
        type: 'story',
        url: 'http://www.getdropbox.com/u/2/screencast.html',
      },
      ok: true,
      status: 200,
      error: null,
    };
    const axiosRes = {
      status: result.status,
      data: result.data,
    };
    const id = 8863;
    // se usi la libreria axios devi usare 'axios.get.' non 'fetch' e json: () => Promise.resolve(result)
    axios.get.mockResolvedValueOnce(axiosRes);
    let url = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    const res = await HN.HackerNewsAPI.getBlockNewsDetails(id);
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('data.by');
    expect(res).toHaveProperty('data.score');
    expect(res).toHaveProperty('data.time');
    expect(res).toHaveProperty('data.title');
    expect(res).toHaveProperty('data.url');
    expect(res).toHaveProperty('ok');
    expect(res).toHaveProperty('status');
    expect(res).toHaveProperty('error');
    expect(res.data.id).toEqual(id);
    expect(Object.getPrototypeOf(res.data)).toEqual(Object.prototype);
    expect(Object.getPrototypeOf(res.ok)).toEqual(Boolean.prototype);
    expect(res.ok).toBe(true);
    expect(Object.getPrototypeOf(res.status)).toEqual(Number.prototype);
    expect(res.error).toBeNull();

    HN.HackerNewsAPI.reset();
  });
  it('Verifica risposta in caso di errore', async () => {
    const result = {
      data: null,
      ok: false,
      status: 400,
      error: 'Bad request',
    };
    const axiosError = {
      response: {
        status: result.status,
        data: {
          error: result.error,
        },
      },
    };
    const id = 8863;
    // mockRejectedValue : testa la parte del catch
    axios.get.mockRejectedValue(axiosError);
    const res = await HN.HackerNewsAPI.getBlockNewsDetails(id);
    expect(axios.get).toHaveBeenCalledTimes(HN.HackerNewsAPI.itemDetails_MAX_RETRIES);
    expect(res.data).toBeNull();
    expect(res.ok).toBe(false);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(Object.getPrototypeOf(res.error)).toEqual(String.prototype);
    HN.HackerNewsAPI.reset();
  });
  it('Verifica chiamate API multiple con campo data.url presente', async () => {
    let i = 0;
    const NUM_NEWS_BLOCK = 10;
    const result = {
      data: {
        by: 'dhouston',
        descendants: 12,
        id: 123421,
        kids: [8952, 8878, 8870, 8980, 8934, 8876],
        score: 111,
        time: 1175714200,
        title: 'My YC app: Dropbox - Throw away your USB drive',
        type: 'story',
        url: 'http://www.getdropbox.com/u/2/screencast.html',
      },
      ok: true,
      status: 200,
      error: null,
    };
    const axiosRes = {
      status: result.status,
      data: result.data,
    };
    const spy = vi.spyOn(HN.HackerNewsAPI, 'getBlockNewsDetails');
    // diversamente da  'mockResolvedValueOnce' mantiene il mock per più volte;
    axios.get.mockResolvedValue(axiosRes);
    while (i < NUM_NEWS_BLOCK) {
      const res = await HN.HackerNewsAPI.getBlockNewsDetails(result.data.id);

      expect(res).toHaveProperty('data');
      expect(typeof res.data).toBe('object');
      expect(res).toHaveProperty('data.by');
      expect(res).toHaveProperty('data.score');
      expect(res).toHaveProperty('data.time');
      expect(res).toHaveProperty('data.title');
      expect(res).toHaveProperty('data.url');
      expect(res).toHaveProperty('ok');
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.error).toBeNull();

      i += 1;
    }
    expect(spy).toHaveBeenCalledTimes(NUM_NEWS_BLOCK);
  });

  it('Verifica chiamate API multiple con data.text non presente', async () => {
    let i = 0;
    const NUM_NEWS_BLOCK = 10;
    const result = {
      data: {
        by: 'dhouston',
        descendants: 12,
        id: 123421,
        kids: [8952, 8878, 8870, 8980, 8934, 8876],
        score: 111,
        time: 1175714200,
        title: 'My YC app: Dropbox - Throw away your USB drive',
        type: 'story',
        text: '"I am tired of Anthropic&#x27;s rate limits. Is there a coding model + coding harness combination that...',
      },
      ok: true,
      status: 200,
      error: null,
    };
    const axiosRes = {
      status: result.status,
      data: result.data,
    };
    const spy = vi.spyOn(HN.HackerNewsAPI, 'getBlockNewsDetails');
    // diversamente da  'mockResolvedValueOnce' mantiene il mock per più volte;
    axios.get.mockResolvedValue(axiosRes);
    while (i < NUM_NEWS_BLOCK) {
      const res = await HN.HackerNewsAPI.getBlockNewsDetails(result.data.id);

      expect(res).toHaveProperty('data');
      expect(typeof res.data).toBe('object');
      expect(res).toHaveProperty('data.by');
      expect(res).toHaveProperty('data.score');
      expect(res).toHaveProperty('data.time');
      expect(res).toHaveProperty('data.title');
      expect(res).toHaveProperty('data.text');
      expect(res).toHaveProperty('ok');
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.error).toBeNull();

      i += 1;
    }
    expect(spy).toHaveBeenCalledTimes(NUM_NEWS_BLOCK);
  });
});
