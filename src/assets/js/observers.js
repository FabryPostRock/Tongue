/*
NEWS TEMPLATE WITH ONLY URL

<div class="news-item" data-news-id="48005744">
  <div class="card flex-fill">             
    <div class="card-body d-flex flex-column">
      <h5 class="card-title secondary-color">Jaron Lanier on the Zeitgeist</h5>
      <div class="mb-3 d-flex justify-content-between">
          <div class="d-flex align-items-center gap-2">
          <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">article_person</span>
          <small class="text-muted mb-0 lh-1">musha68k</small>
          </div>
          <div class="d-flex align-items-center gap-2">
          <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">thumb_up</span>
          <span class="secondary-color lh-1">1</span>
          </div>
      </div>
      <div class="mt-auto mb-3 d-flex justify-content-between">
          <a href="https://www.youtube.com/watch?v=Vmx3SbgoPZc" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Leggi</a>
          <div class="d-flex align-items-end gap-2">
            <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
            <small class="text-muted mb-0 lh-1">Mon May 04 2026</small>
          </div>
      </div>
    </div>
  </div>
</div>

NEWS TEMPLATE WITH TEXT
<div class="news-item" data-news-id="48005705">
  <div class="card flex-fill"> 
    <div class="card-body d-flex flex-column">
      <h5 class="card-title secondary-color">Everything needs to be open source. Why I decided to open source my project</h5>
      <p class="card-text news-extra">
          Everything needs to be open source. Why I decided to open source my project. and Why I think you should join the movement.
      </p>
      <p>I work in a security firm that belives everything needs to be open source.
          Thats why I decided to open source our product. Hoping I will get a lot of love from the community and this will make other 
          security firms consider open sourcing some of their products as well.
      </p>
      <p>open source will be good for the world. Give us love (and a github star ) if you want to help us in our mission to make 
            the world more open source!
            https://github.com/Cybereason-Public/owLSM
      </p>
      <p>
        P.S I belive in karma. if I do good now (by giving this project to the community)god will help me in the future.<
      /p>
      <div class="mb-3 d-flex justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">article_person</span>
            <small class="text-muted mb-0 lh-1">SilverPlate3</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">thumb_up</span>
            <span class="secondary-color lh-1">1</span>
          </div>
      </div>
      <div class="mt-auto mb-3 d-flex justify-content-between">
          <div class="d-flex align-items-end gap-2">
            <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
            <small class="text-muted mb-0 lh-1">Mon May 04 2026</small>
          </div>
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
    divCard.className = 'news-item cursor-pointer';
    divCard.setAttribute('data-news-id', news.id);

    if (news?.url) {
      /*
      flex-fill : definisce 
        flex-grow: 1 !important;
        flex-shrink: 1 !important;
      mt-auto : serve a strechare la parte bassa in modo che venga spinta in basso
      */
      divCard.innerHTML = `
            <div class="card flex-fill">             
              <div class="card-body d-flex flex-column">
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
                <div class="mt-auto mb-3 d-flex justify-content-between">
                    <a href="${news.url}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Leggi</a>
                    <div class="d-flex align-items-end gap-2">
                      <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
                      <small class="text-muted mb-0 lh-1">${news.time}</small>
                    </div>
                </div>
              </div>
            </div>
            `;
    } else if (news?.text) {
      divCard.innerHTML = `
          <div class="card flex-fill"> 
            <div class="card-body d-flex flex-column">
              <h5 class="card-title secondary-color">${news.title}</h5>
              <div class="news-extra">${news.text}</div>
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
              <div class="mt-auto mb-3 d-flex justify-content-between">
                  <div class="d-flex align-items-end gap-2">
                    <span class="material-symbols-outlined g-icon-1em g-icon-secondary-color lh-1">calendar_month</span>
                    <small class="text-muted mb-0 lh-1">${news.time}</small>
                  </div>
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
