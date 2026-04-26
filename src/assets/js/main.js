import { HackerNewsAPI } from './hacker_news_api.js';
import { News } from './observable.js';
import { renderNewsChange } from './observers.js';
import { safeStorage } from './utilities.js';

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
  kEnNewsUpdates: 'news:enNewsUpdates',
};

async function getNewsBlock(obs, { kItemsIds, kIdxStartId, kEnNewsUpdates }) {
  const NUM_NEWS_BLOCK = 10;
  const itemsIds = safeStorage.getFrom(sessionStorage, kItemsIds);
  let setTid = null;
  let enNewsUpdates = null;
  enNewsUpdates = safeStorage.getFrom(sessionStorage, kEnNewsUpdates);

  // itemsIds dev'essere un array
  if (itemsIds?.data && Object.getPrototypeOf(itemsIds?.data) === Array.prototype) {
    let idxStartId = safeStorage.getFrom(sessionStorage, kIdxStartId);
    // verifico se è già stato salvato l'indice di partenza del blocco di news
    if (!idxStartId || typeof idxStartId !== 'number') {
      idxStartId = 0;
    }
    let idxEndId = null;
    // stabilisco l'indice finale del blocco di news
    if (idxStartId + NUM_NEWS_BLOCK - 1 > itemsIds.data.length) {
      idxEndId = itemsIds.data.length;
    } else {
      idxEndId = idxStartId + NUM_NEWS_BLOCK - 1;
    }
    obs.subscribe(renderNewsChange);
    if (!enNewsUpdates) {
      for (let i = idxStartId; i < idxEndId; i++) {
        console.log(`INDICI ${idxStartId} - ${idxEndId} - ${i}`);
        let newsData = null;
        newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[i]);

        //if (newsData?.data) obs.addNews(newsData.data);
        console.log('newsData', newsData.data.id);
      }
    }
    if (idxEndId + 1 < itemsIds.data.length) {
      safeStorage.setTo(sessionStorage, kIdxStartId, idxEndId + 1);
    } else {
      safeStorage.setTo(sessionStorage, kEnNewsUpdates, true);
    }
    console.log(`INDICI ${idxStartId} - ${idxEndId} `);
  } else {
    throw new Error('Could not retrive news Ids!');
  }
}

try {
  const n = new News();
  if (!safeStorage.getFrom(sessionStorage, STORAGE_NEWS.kEnNewsUpdates))
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kEnNewsUpdates, false);

  document.addEventListener('DOMContentLoaded', async () => {
    const itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
    // Oggetto da salvare in storage come stringa
    //safeStorage.setTo(sessionStorage, STORAGE_NEWS.kIdxStartId, 495);
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kItemsIds, itemsIds);
    console.log('********************************PRIMA CALL**************************************');
    await getNewsBlock(n, STORAGE_NEWS);
    console.log('********************************FINE********************************************');
  });
} catch (err) {
  console.error(err);
}
