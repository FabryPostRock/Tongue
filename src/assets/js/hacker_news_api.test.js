import { HackerNewsAPI } from "./hacker_news_api.js";
import axios from "axios";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("HackerNewsAPI", () => {
  // se stai usando la libreria 'axios' devi mockare quella, se moki 'fetch' il test fallisce.

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Verifica url e tipo risultato della chiamata", async () => {
    const result = {
      data: [1, 2, 3, 4, 5],
      ok: true,
      status: 200,
      error: null,
    };
    // mockResolvedValueOnce : testa la parte del try
    axios.get.mockResolvedValueOnce(result);
    const url = "https://hacker-news.firebaseio.com/v0/newstories.json";
    const res = await HackerNewsAPI.getAllNewsIDs(url);
    expect(axios.get).toHaveBeenCalledWith(url);
    expect(res).toEqual(result);
    //devo resettare le varibili di classe perchè il suo 'state' non si resetta con un nuovo test
    HackerNewsAPI.reset();
    afterEach(() => {
      vi.clearAllMocks();
    });
  });
  it("Verifica keys and values del risultato della call", async () => {
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
    const url = "https://hacker-news.firebaseio.com/v0/newstories.json";
    const res = await HackerNewsAPI.getAllNewsIDs(url);
    expect(res).toHaveProperty("data");
    expect(res).toHaveProperty("ok");
    expect(res).toHaveProperty("status");
    expect(res).toHaveProperty("error");
    expect(Object.getPrototypeOf(res.data)).toEqual(Array.prototype);
    expect(Object.getPrototypeOf(res.ok)).toEqual(Boolean.prototype);
    expect(Object.getPrototypeOf(res.status)).toEqual(Number.prototype);
    expect(res.error).toBeNull();

    HackerNewsAPI.reset();
    afterEach(() => {
      vi.clearAllMocks();
    });
  });

  it("Verifica risposta in caso di errore", async () => {
    const result = {
      data: null,
      ok: false,
      status: 400,
      error: "Bad request",
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
    const url = "https://hacker-news.firebaseio.com/v0/newstories.json";
    const res = await HackerNewsAPI.getAllNewsIDs(url);
    expect(axios.get).toHaveBeenCalledTimes(HackerNewsAPI.MAX_RETRIES);
    expect(res.data).toBeNull();
    expect(res.ok).toBe(false);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(Object.getPrototypeOf(res.error)).toEqual(String.prototype);
    HackerNewsAPI.reset();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
});
