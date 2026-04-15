import { HackerNewsAPI } from "./hacker_news_api.js";

try {
  const res = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
  const res2 = await HackerNewsAPI.getBlockNewsDetails(res.data[0]);
  console.log(res.data);
} catch (err) {
  console.error(err);
}
