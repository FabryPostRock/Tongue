/*
CREATION OF THIS HTML CONTENT
        <div class="card col-12 col-md-4 col-lg-3 w-max-18-rem m-2">
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
const el = (tag, { className, id, attrs, text } = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (id) node.id = id;
  if (text != null) node.textContent = text;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (!v) continue;
      node.setAttribute(k, String(v));
    }
  }
  return node;
};

export function createNewsDomEl(title, by, id, score, time, url) {
  // data-news-id is important to identify the object again.
  const divCard = el('div', {
    className: 'card col-12 col-md-4 col-lg-3 w-max-18-rem m-2',
    attrs: { 'data-news-id': id },
  });
  const divCardBody = el('div', { className: 'card-body' });
  const h5 = el('h5', { className: 'card-title secondary-color', text: title });
  const divContent = el('div', { className: 'mb-3 d-flex justify-content-between' });
  const divBotInfoLX = el('div', { className: 'd-flex align-items-center gap-2' });
  const divBotInfoRX = el('div', { className: 'd-flex align-items-center gap-2' });
  const spanIconLX = el('span', {
    className: 'material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1',
    text: 'article_person',
  });
  const spanIconRX = el('span', {
    className: 'material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1',
    text: 'thumb_up',
  });
  const smallTxtLX = el('small', { className: 'text-muted mb-0 lh-1', text: by });
  const spanTxtRX = el('small', { className: 'secondary-color lh-1', text: score });
  const divContentBot = el('div', { className: 'mb-3 d-flex justify-content-between' });
  const divTime = el('div', { className: 'd-flex align-items-end gap-2' });
  const btn = el('a', {
    className: 'btn btn-secondary',
    attrs: {
      href: url,
      target: '_blank',
    },
    text: 'Leggi',
  });
  const spanIconBotLX = el('span', {
    className: 'material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1',
    text: 'calendar_month',
  });
  const smallDataRX = el('small', { className: 'text-muted mb-0 lh-1', text: time });

  divCard.appendChild(divCardBody);
  divCardBody.append(h5, divContent, divContentBot);
  divContent.append(divBotInfoLX, divBotInfoRX);
  divBotInfoLX.append(spanIconLX, smallTxtLX);
  divBotInfoRX.append(spanIconRX, spanTxtRX);
  divContentBot.append(btn, divTime);
  divTime.append(spanIconBotLX, smallDataRX);
}

/*---------------------------------------------------observer → aggiorna la UI---------------------------------------------*/
export function renderNewsChange({ noteType, news }) {
  // The function is wrapped by the Observable and than data are sent to the function via
  if (noteType === 'add') {
    const card = createNewsDomEl(news);
    parentNode.appendChild(card);
    return;
  }

  if (noteType === 'remove') {
    const card = parentNode.querySelector(`[data-news-id="${news.id}"]`);
    if (card) card.remove();
  }
}
