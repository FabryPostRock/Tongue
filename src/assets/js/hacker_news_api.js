import axios from "axios";
export class HackerNewsAPI {
  static URL_ID_DETAILS = (id) =>
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

  static itemsIds = {
    URL: "https://hacker-news.firebaseio.com/v0/newstories.json",
    MAX_RETRIES: 3,
    actualRetries: 0,
    response: null,
    error: null,
  };

  static itemDetails = {
    // ...itemsIds va messo prima nel destructuring per non sovrascrivere le assegnazioni custom
    ...HackerNewsAPI.itemsIds,
    URL: HackerNewsAPI.URL_ID_DETAILS,
    MAX_RETRIES: 3,
  };

  static async getAllNewsIDs(url) {
    while (
      HackerNewsAPI.itemsIds.actualRetries < HackerNewsAPI.itemsIds.MAX_RETRIES
    ) {
      try {
        HackerNewsAPI.itemsIds.response = await axios.get(url);
        HackerNewsAPI.itemsIds.actualRetries += 1;
        return {
          data: HackerNewsAPI.itemsIds.response?.data,
          ok: true,
          status: HackerNewsAPI.itemsIds.response?.status,
          error: null,
        };
      } catch (err) {
        HackerNewsAPI.itemsIds.error = err;
        HackerNewsAPI.itemsIds.actualRetries += 1;
        //non uso 'throw new Error' per non interrompere la ripetizione delle chiamate
        console.error(
          `Status:  ${HackerNewsAPI.itemsIds.error.response?.status}\n` +
            `Body: ${HackerNewsAPI.itemsIds.error.response?.data?.error}\n` +
            `Tentativi rimasti : ${HackerNewsAPI.itemsIds.MAX_RETRIES - HackerNewsAPI.itemsIds.actualRetries}`,
        );
      }
    }
    return {
      data: null,
      ok: false,
      status: HackerNewsAPI.itemsIds.error.response?.status,
      error: HackerNewsAPI.itemsIds.error.response?.data?.error,
    };
  }

  static async getBlockNewsDetails(id) {
    while (
      HackerNewsAPI.itemDetails.actualRetries <
      HackerNewsAPI.itemDetails.MAX_RETRIES
    ) {
      try {
        HackerNewsAPI.itemDetails.response = await axios.get(
          HackerNewsAPI.URL_ID_DETAILS(id),
        );
        HackerNewsAPI.itemDetails.actualRetries += 1;
        console.log(
          "HackerNewsAPI.itemDetails.response",
          HackerNewsAPI.itemDetails.response,
        );
        return {
          data: HackerNewsAPI.itemDetails.response?.data,
          ok: true,
          status: HackerNewsAPI.itemDetails.response?.status,
          error: null,
        };
      } catch (err) {
        HackerNewsAPI.itemDetails.error = err;
        HackerNewsAPI.itemDetails.actualRetries += 1;
        //non uso 'throw new Error' per non interrompere la ripetizione delle chiamate
        console.error(
          `Status:  ${HackerNewsAPI.itemDetails.error.response?.status}\n` +
            `Body: ${HackerNewsAPI.itemDetails.error.response?.data?.error}\n` +
            `Tentativi rimasti : ${HackerNewsAPI.itemDetails.MAX_RETRIES - HackerNewsAPI.itemDetails.actualRetries}`,
        );
      }
    }

    return {
      data: null,
      ok: false,
      status: HackerNewsAPI.itemDetails.error.response?.status,
      error: HackerNewsAPI.itemDetails.error.response?.data?.error,
    };
  }

  constructor() {
    throw new Error("HackerNewsAPI cannot be instantiated.");
  }

  static reset() {
    HackerNewsAPI.itemsIds = {
      ...HackerNewsAPI.itemsIds,
      actualRetries: 0,
      response: null,
      error: null,
    };

    HackerNewsAPI.itemDetails = {
      ...HackerNewsAPI.itemDetails,
      actualRetries: 0,
      response: null,
      error: null,
    };
  }

  static get itemsIds_MAX_RETRIES() {
    return HackerNewsAPI.itemsIds.MAX_RETRIES;
  }

  static get itemDetails_MAX_RETRIES() {
    return HackerNewsAPI.itemDetails.MAX_RETRIES;
  }
}
