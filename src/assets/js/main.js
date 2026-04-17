import { HackerNewsAPI } from './hacker_news_api.js';

try {
  const itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
  const newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[0]);
  console.log(res.data);
} catch (err) {
  console.error(err);
}
