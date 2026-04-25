import { HackerNewsAPI } from './hacker_news_api.js';
import { News } from './observable.js';
import { renderNewsChange } from './observers.js';
import { safeStorage } from './utilities.js';

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
};

function safeGetFromStorage(el) {
  if (el)
    try {
      return JSON.parse(sessionStorage.getItem(el));
    } catch (err) {
      throw new Error('el parsing has generated an error!', err);
    }
  else {
    throw new Error('el parameter was null or undefined');
  }
}
async function getNewsBlock(obs, { kItemsIds, kIdxStartId }) {
  const NUM_NEWS_BLOCK = 10;
  let itemsIds = null;
  let setTid = null;

  itemsIds = safeGetFromStorage(kItemsIds);
  // itemsIds dev'essere un array
  if (itemsIds?.data && Object.getPrototypeOf(itemsIds?.data) === Array.prototype) {
    let idxStartId = JSON.parse(sessionStorage.getItem(kIdxStartId));
    // verifico se è già stato salvato l'indice di partenza del blocco di news
    if (!idxStartId || typeof idxStartId !== 'number') {
      idxStartId = 0;
    }
    let idxEndId = null;
    // stabilisco l'indice finale del blocco di news

    if (idxStartId + NUM_NEWS_BLOCK - 1 > itemsIds.data.length) {
      console.log(
        `INDICI (idxStartId + NUM_NEWS_BLOCK - 1 > itemsIds.data.length) ${idxStartId} - ${idxEndId} - ${itemsIds.data.length}`,
      );
      idxEndId = itemsIds.data.length;
    } else {
      idxEndId = idxStartId + NUM_NEWS_BLOCK - 1;
    }
    obs.subscribe(renderNewsChange);
    for (let i = idxStartId; i < idxEndId; i++) {
      console.log(`INDICI ${idxStartId} - ${idxEndId} - ${itemsIds.data.length}`);
      let newsData = null;
      newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[i]);

      //if (newsData?.data) obs.addNews(newsData.data);
      console.log('newsData', newsData.data.id);
    }
    if (idxEndId + 1 < itemsIds.data.length) {
      sessionStorage.setItem(kIdxStartId, idxEndId + 1);
    }
    console.log(`INDICI ${idxStartId} - ${idxEndId} `);
  } else {
    throw new Error('Could not retrive news Ids!');
  }
}

try {
  const n = new News();
  safeStorage.SetTo(sessionStorage, 'test', 10);
  const test2 = safeStorage.GetFrom(sessionStorage, 'test');
  console.log(test2);
  document.addEventListener('DOMContentLoaded', async () => {
    const itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
    // Oggetto da salvare in storage come stringa
    await sessionStorage.setItem(STORAGE_NEWS.kItemsIds, JSON.stringify(itemsIds));
    console.log('********************************PRIMA CALL**************************************');
    await getNewsBlock(n, STORAGE_NEWS);
    console.log('********************************FINE********************************************');
  });
} catch (err) {
  console.error(err);
}
