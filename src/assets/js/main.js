import { HackerNewsAPI } from './hacker_news_api.js';
import { News } from './observable.js';
import { renderNewsChange, parentNode, elements, intObs } from './observers.js';
import { safeStorage } from './utilities.js';

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
  kEnNewsUpdates: 'news:enNewsUpdates',
};

export async function getNewsBlock(obs, { kItemsIds, kIdxStartId, kEnNewsUpdates }) {
  const NUM_NEWS_BLOCK = 10;
  let setTid = null;
  let enNewsUpdates = null;
  if (
    !kItemsIds ||
    !kIdxStartId ||
    !kEnNewsUpdates ||
    !obs ||
    typeof kItemsIds !== 'string' ||
    typeof kIdxStartId !== 'string' ||
    typeof kEnNewsUpdates !== 'string' ||
    Object.getPrototypeOf(obs) !== News.prototype
  ) {
    throw new Error('One or more function parameters are not correct or missing!');
  }
  const itemsIds = safeStorage.getFrom(sessionStorage, kItemsIds);
  enNewsUpdates = safeStorage.getFrom(sessionStorage, kEnNewsUpdates);

  //Check enNewsUpdates
  if (enNewsUpdates == null || enNewsUpdates == undefined)
    throw new Error("Can't proceed because enNewsUpdates is not valid");

  // itemsIds.data dev'essere un array
  if (itemsIds?.data && Object.getPrototypeOf(itemsIds?.data) === Array.prototype) {
    let idxStartId = safeStorage.getFrom(sessionStorage, kIdxStartId);
    // verifico se è già stato salvato l'indice di partenza del blocco di news
    if (!idxStartId || typeof idxStartId !== 'number') {
      idxStartId = 0;
    }
    let idxEndId = null;
    // stabilisco l'indice finale del blocco di news
    if (idxStartId + NUM_NEWS_BLOCK > itemsIds.data.length) {
      idxEndId = itemsIds.data.length;
    } else {
      idxEndId = idxStartId + NUM_NEWS_BLOCK;
    }
    obs.subscribe(renderNewsChange);
    if (!enNewsUpdates) {
      for (let i = idxStartId; i < idxEndId; i++) {
        console.log(`INDICI ${idxStartId} - ${idxEndId} - ${i}`);
        let newsData = null;
        newsData = await HackerNewsAPI.getBlockNewsDetails(itemsIds.data[i]);

        if (newsData?.data) obs.addNews(newsData.data);
        console.log('newsData', newsData.data.id);
      }
    }
    if (idxEndId < itemsIds.data.length) {
      safeStorage.setTo(sessionStorage, kIdxStartId, idxEndId);
    } else {
      safeStorage.setTo(sessionStorage, kIdxStartId, idxEndId);
      safeStorage.setTo(sessionStorage, kEnNewsUpdates, true);
    }
  } else {
    throw new Error('Could not retrive news Ids!');
  }
}

try {
  const n = new News();
  if (!safeStorage.getFrom(sessionStorage, STORAGE_NEWS.kEnNewsUpdates))
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kEnNewsUpdates, false);

  document.addEventListener('DOMContentLoaded', async () => {
    if (elements && intObs && Object.getPrototypeOf(intObs) === IntersectionObserver.prototype) {
      elements.forEach((el) => {
        intObs.observe(el);
      });
    } else {
      console.log('Something went wrong in animations');
    }
    const itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
    // Oggetto da salvare in storage come stringa
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kItemsIds, itemsIds);

    //Loads n new news cards
    await getNewsBlock(n, STORAGE_NEWS);
  });

  const btnLoadNews = document.querySelector('.load-more-btn');
  btnLoadNews.addEventListener('click', async () => {
    // This condition avoids a new click event while an event is already triggered
    if (btnLoadNews.disabled) return;

    btnLoadNews.disabled = true;

    try {
      await getNewsBlock(n, STORAGE_NEWS);
    } catch (err) {
      console.error(err);
      //finally is always executed and is necessary in case of  getNewsBlock exception to re-enable the btn
    } finally {
      btnLoadNews.disabled = false;
    }
  });
} catch (err) {
  console.error(err);
}
