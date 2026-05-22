import { HackerNewsAPI } from './hacker_news_api.js';
import { News } from './observable.js';
import { safeStorage } from './utilities.js';

const STORAGE_NEWS = {
  kItemsIds: 'news:itemsIds',
  kIdxStartId: 'news:idxStartId',
  kEnNewsUpdates: 'news:enNewsUpdates',
  kIsInitPage: 'news:isInitPage',
};

const n = new News();

export const PAR_ERROR = 'One or more function parameters are not correct or missing!';
export const NO_ID_SEL_NEWS_ERROR = 'No id parameter for the selected news!';
export const SLIDE_IN_ERROR = 'Page is loaded but something is wrong with elements sliding in';
export const NEWS_ITEMS_QUERY_ERROR = 'No News items retrieved';

export async function getNewsBlock(obs, { kItemsIds, kIdxStartId, kEnNewsUpdates }, obsFun) {
  /* This function manages multiple news requests and the next news block to show*/
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
    Object.getPrototypeOf(obs) !== News.prototype ||
    typeof obsFun !== 'function'
  ) {
    throw new Error(PAR_ERROR);
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
    obs.subscribe(obsFun);
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

async function getNewsBlockWrapper(el, obs, obsFun) {
  // This condition avoids a new click event while an event is already triggered
  if (el.disabled || !obs || Object.getPrototypeOf(obs) !== News.prototype || typeof obsFun !== 'function')
    throw new Error(PAR_ERROR);
  el.disabled = true;

  try {
    await getNewsBlock(n, STORAGE_NEWS, obsFun);
    deleteSelNews(obs);
  } catch (err) {
    console.error(err);
    //finally is always executed and is necessary in case of  getNewsBlock exception to re-enable the btn
  } finally {
    el.disabled = false;
  }
}

export function deleteSelNews(obs) {
  /* The function configures every new 'news' element for deletion*/
  if (!obs || Object.getPrototypeOf(obs) !== News.prototype) throw new Error(PAR_ERROR);
  let dataNewsIds = null;
  dataNewsIds = document.querySelectorAll('div[data-news-id]');
  // querySelectorAll restituisce sempre qualcosa di non null quindi bisogna controllare la lunghezza
  if (dataNewsIds.length === 0) throw new Error(NEWS_ITEMS_QUERY_ERROR);
  dataNewsIds.forEach((el) => {
    if (!el?.dataset?.newsId) throw new Error(NO_ID_SEL_NEWS_ERROR);
    try {
      el.addEventListener('click', async () => await obs.removeNews(parseInt(el.dataset.newsId)));
    } catch (err) {
      console.error('In function deleteSelNews : ', err);
    }
  });
}

/*-------------------------MAIN ------------------------------*/
let itemsIds = null;
try {
  if (!safeStorage.getFrom(sessionStorage, STORAGE_NEWS.kEnNewsUpdates))
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kEnNewsUpdates, false);

  // When page is loaded
  document.addEventListener('DOMContentLoaded', async () => {
    // Dynamic loading is used because inside the modules there are variables read from DOM tree
    const { renderNewsChange, parentNode, elements, intObs } = await import('./observers.js');
    const { animate } = await import('./animations.js');

    //btns to load news or reset the news counter
    const btnLoadNews = document.querySelector('.load-more-btn');
    const btnResetAndLoadNews = document.querySelector('.reset-news-count-and-load-btn');
    btnLoadNews.addEventListener('click', async () => await getNewsBlockWrapper(btnLoadNews, n, renderNewsChange));

    btnResetAndLoadNews.addEventListener('click', () => {
      /*this action reloads the page and as consequence it updates the list of news*/
      safeStorage.setTo(sessionStorage, STORAGE_NEWS.kIdxStartId, 0);
      location.reload();
    });

    if (elements && intObs && Object.getPrototypeOf(intObs) === IntersectionObserver.prototype) {
      elements.forEach((el) => {
        intObs.observe(el);
      });
    } else {
      throw new Error(SLIDE_IN_ERROR);
    }
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kIdxStartId, 0);
    itemsIds = await HackerNewsAPI.getAllNewsIDs(HackerNewsAPI.itemsIds.URL);
    // Oggetto da salvare in storage come stringa
    safeStorage.setTo(sessionStorage, STORAGE_NEWS.kItemsIds, itemsIds);
    //Loads n new news cards
    await getNewsBlock(n, STORAGE_NEWS, renderNewsChange);
    deleteSelNews(n);
    // Lens that bounces around
    animate();
  });
} catch (err) {
  console.error(err);
}
