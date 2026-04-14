import axios from "axios";
export class HackerNewsAPI {
  static #MAX_RETRIES = 10;
  static #actualRetries = 0;
  static #response = null;
  static #error = null;
  static async getAllNewsIDs() {
    while (HackerNewsAPI.#actualRetries < HackerNewsAPI.#MAX_RETRIES) {
      try {
        HackerNewsAPI.#response = await axios.get(
          "https://hacker-news.firebaseio.com/v1/newstories.json",
        );
        console.log(HackerNewsAPI.#response.data);
        HackerNewsAPI.#actualRetries += 1;
        break;
      } catch (err) {
        HackerNewsAPI.#error = err;
        HackerNewsAPI.#actualRetries += 1;
        //non uso 'throw new Error' per non interrompere la ripetizione delle chiamate
        console.error(
          `Status:  ${HackerNewsAPI.#error.response?.status}\n` +
            `Body: ${HackerNewsAPI.#error.response?.data?.error}\n` +
            `Tentativi rimasti : ${HackerNewsAPI.#MAX_RETRIES - HackerNewsAPI.#actualRetries}`,
        );
      }
    }
  }

  constructor() {
    throw new Error("HackerNewsAPI cannot be instantiated.");
  }

  static get MAX_RETRIES() {
    return HackerNewsAPI.#MAX_RETRIES;
  }

  static get actualRetries() {
    return HackerNewsAPI.#actualRetries;
  }

  static get response() {
    return HackerNewsAPI.#response;
  }

  static get error() {
    return HackerNewsAPI.#error;
  }
}
