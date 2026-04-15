import axios from "axios";
export class HackerNewsAPI {
  static MAX_RETRIES = 10;
  static actualRetries = 0;
  static response = null;
  static error = null;
  static URL_IDS = "https://hacker-news.firebaseio.com/v0/newstories.json";
  static async getAllNewsIDs(url) {
    while (HackerNewsAPI.actualRetries < HackerNewsAPI.MAX_RETRIES) {
      try {
        HackerNewsAPI.response = await axios.get(url);
        HackerNewsAPI.actualRetries += 1;
        return {
          data: HackerNewsAPI.response?.data,
          ok: true,
          status: HackerNewsAPI.response?.status,
          error: null,
        };
      } catch (err) {
        HackerNewsAPI.error = err;
        HackerNewsAPI.actualRetries += 1;
        //non uso 'throw new Error' per non interrompere la ripetizione delle chiamate
        console.error(
          `Status:  ${HackerNewsAPI.error.response?.status}\n` +
            `Body: ${HackerNewsAPI.error.response?.data?.error}\n` +
            `Tentativi rimasti : ${HackerNewsAPI.MAX_RETRIES - HackerNewsAPI.actualRetries}`,
        );
      }
    }
    return {
      data: null,
      ok: false,
      status: HackerNewsAPI.error.response?.status,
      error: HackerNewsAPI.error.response?.data?.error,
    };
  }

  constructor() {
    throw new Error("HackerNewsAPI cannot be instantiated.");
  }

  static reset() {
    HackerNewsAPI.actualRetries = 0;
    HackerNewsAPI.response = null;
    HackerNewsAPI.error = null;
  }

  static get MAX_RETRIES() {
    return HackerNewsAPI.MAX_RETRIES;
  }

  static get actualRetries() {
    return HackerNewsAPI.actualRetries;
  }

  static get response() {
    return HackerNewsAPI.response;
  }

  static get error() {
    return HackerNewsAPI.error;
  }
}
