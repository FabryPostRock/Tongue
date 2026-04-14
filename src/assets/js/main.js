import { HackerNewsAPI } from "./hacker_news_api.js";

try {
  await HackerNewsAPI.getAllNewsIDs();
} catch (err) {
  console.error(err);
}
