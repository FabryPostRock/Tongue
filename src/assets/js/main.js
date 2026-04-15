import { HackerNewsAPI } from "./hacker_news_api.js";

try {
  const res = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.URL_IDS);
  console.log(res.data);
} catch (err) {
  console.error(err);
}
