import { HackerNewsAPI } from './hacker_news_api.js';
import { News } from './observable.js';
import { renderNewsChange } from './observers.js';

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
};

async function getNewsBlock(obs, { kItemsIds, kIdxStartId }) {
  const NUM_NEWS_BLOCK = 10;
  let itemsIds = null;
  let setTid = null;
  if (kItemsIds) {
    itemsIds = JSON.parse(sessionStorage.getItem(kItemsIds));
  } else {
    return;
  }
  // itemsIds dev'essere un array
  if (itemsIds?.data && Object.getPrototypeOf(itemsIds?.data) === Array.prototype) {
    let idxStartId = null;
    // verifico se è già stato salvato l'indice di partenza del blocco di news
    if (sessionStorage.getItem(kIdxStartId)) {
      idxStartId = sessionStorage.getItem(kIdxStartId);
    } else {
      idxStartId = 0;
    }
    let idxEndId = null;
    // stabilisco l'indice finale del blocco di news
    if (idxStartId + NUM_NEWS_BLOCK - 1 > itemsIds.data.length) {
      idxEndId = itemsIds.data.length;
    } else {
      idxEndId = idxStartId + NUM_NEWS_BLOCK - 1;
    }

    for (let i = idxStartId; i < idxEndId; i++) {
      console.log('AAAAAA');
      let newsData = null;
      /*setTid = setTimeout(async () => {
        newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[i]);
        obs.subscribe(renderNewsChange);
        if (newsData?.data) obs.addNews(newsData.data);
        console.log('BBBBBBBB');
      }, 2000);*/
      newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[i]);
      //obs.subscribe(renderNewsChange);
      //if (newsData?.data) obs.addNews(newsData.data);
      console.log('CCCCCCCCC');
      console.log('newsData', newsData.data.by);
    }
    if (idxEndId + 1 < itemsIds.length) {
      sessionStorage.setItem(kIdxStartId, idxEndId + 1);
    }
    clearTimeout(setTid);
    console.log('DDDDDDDDDD');
  } else {
    throw new Error('Could not retrive news Ids!');
  }
}

try {
  document.addEventListener('DOMContentLoaded', async () => {
    const itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
    // Oggetto da salvare in storage come stringa
    sessionStorage.setItem(STORAGE_NEWS.kItemsIds, JSON.stringify(itemsIds));
  });

  const n = new News();
  await getNewsBlock(n, STORAGE_NEWS);
} catch (err) {
  console.error(err);
}
