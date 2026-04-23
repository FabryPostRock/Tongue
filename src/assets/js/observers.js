/*
CREATION OF THIS HTML CONTENT
        <div class="card col-12 col-md-4 col-lg-3 w-max-18-rem m-2" data-news-id = 123213>
          <div class="card-body">
            <h5 class="card-title secondary-color">Card title</h5>
            <!--<p class="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>-->
            <div class="mb-3 d-flex justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">article_person</span>
                <small class="text-muted mb-0 lh-1">Ciccio Pasticcio</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">thumb_up</span>
                <span class="secondary-color lh-1">100</span>
              </div>
            </div>
            <div class="mb-3 d-flex justify-content-between">
              <a href="https://test.com" class="btn btn-secondary" target="_blank">Card link</a>
              <div class="d-flex align-items-end gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
                <small class="text-muted mb-0 lh-1">Fri 5 April 2024</small>
              </div>
            </div>
          </div>
        </div>

*/

/*---------------------------------------------------factory function DOM---------------------------------------------*/
const NEWS_CONTAINER_ID = '#news-container';
const parentNode = document.querySelector(NEWS_CONTAINER_ID);

export function createNewsDomEl(news) {
  if (typeof news === 'object') {
    // data-news-id is important to identify the object again.
    const divCard = document.createElement('div');
    divCard.className = 'card col-12 col-md-4 col-lg-3 w-max-18-rem m-2';
    divCard.setAttribute('data-news-id', news.id);
    if (news?.url) {
      divCard.innerHTML = `
            <div class="card-body">
            <h5 class="card-title secondary-color">${news.title}</h5>
            <div class="mb-3 d-flex justify-content-between">
                <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">article_person</span>
                <small class="text-muted mb-0 lh-1">${news.by}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">thumb_up</span>
                <span class="secondary-color lh-1">${news.score}</span>
                </div>
            </div>
            <div class="mb-3 d-flex justify-content-between">
                <a href="${news.url}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Leggi</a>
                <div class="d-flex align-items-end gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
                <small class="text-muted mb-0 lh-1">${news.time}</small>
                </div>
            </div>
            </div>
            `;
    } else if (news?.text) {
      divCard.innerHTML = `
            <div class="card-body">
            <h5 class="card-title secondary-color">${news.title}</h5>
            <p class="card-text">
                ${news.text.slice(0, 100)}
                <details>
                    <summary>Mostra altro</summary>
                    ${news.text.slice(100)}
                </details>
            </p>
            <div class="mb-3 d-flex justify-content-between">
                <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">article_person</span>
                <small class="text-muted mb-0 lh-1">${news.by}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">thumb_up</span>
                <span class="secondary-color lh-1">${news.score}</span>
                </div>
            </div>
            <div class="mb-3 d-flex justify-content-between">
                 
                <div class="d-flex align-items-end gap-2">
                <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
                <small class="text-muted mb-0 lh-1">${news.time}</small>
                </div>
            </div>
            </div>
            `;
    }
    return divCard;
  } else {
    throw new TypeError(`The expected parameter type is Object but ${typeof news}`);
  }
}

/*---------------------------------------------------observer → aggiorna la UI---------------------------------------------*/
export function renderNewsChange({ noteType, news }) {
  // The function is wrapped by the Observable and than data are sent to the function with the method 'addNews'
  if (noteType === 'add') {
    const card = createNewsDomEl(news);
    parentNode.appendChild(card);
    return;
  }

  if (noteType === 'remove') {
    const card = parentNode.querySelector(`[data-news-id="${news.id}"]`);
    if (card) {
      card.remove();
    } else {
      throw new Error(`No html elements with the id ${news.id}`);
    }
  }
}
