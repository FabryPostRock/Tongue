export class Observable {
  constructor() {
    this.observers = new Set();
  }

  #subscribeChecks(fn) {
    if (typeof fn !== 'function') throw new TypeError('The observer is not a function');
  }

  #unsubscribeChecks(fn) {
    this.#subscribeChecks(fn);
    if (!this.observers.has(fn))
      throw new Error("This observer can't be subscribed because it's not in the subscribers list");
  }

  subscribe(fn) {
    this.#subscribeChecks(fn);
    this.observers.add(fn);
  }

  unsubscribe(fn) {
    this.#unsubscribeChecks(fn);
    this.observers.delete(fn);
  }

  notify(data) {
    for (const fn of this.observers) {
      try {
        fn(data);
      } catch (err) {
        console.error('Observer error:', err);
      }
    }
  }

  get size() {
    return this.observers.size;
  }
}

export class News extends Observable {
  constructor() {
    super();
    this.items = new Map();
  }

  addNews(item) {
    if (!item || !item.id || !item.by || !item.url || !item.title || !item.type) {
      throw new TypeError('item deve avere id e by url type e title');
    }
    const el = this.items.get(item.id);
    let dateUnix = 'Invalid Date';
    let dateToReadbleStr = null;
    if (el) {
      throw new Error('This News already exists!');
    } else {
      if (item?.time) {
        if (String(Math.abs(item.time)).length <= 10) {
          if (String(Math.abs(item.time)).length == 10) {
            dateUnix = item.time * 1000;
            dateToReadbleStr = new Date(dateUnix).toString().match(/^(.+?)\s\d{2}:\d{2}:\d{2}/)[1];
          }
        } else {
          dateToReadbleStr = new Date(item.time).toString().match(/^(.+?)\s\d{2}:\d{2}:\d{2}/)[1];
        }
      }
      const savedNews = {
        id: item.id,
        by: item.by,
        score: item?.score ? item.score : 0,
        // Formato Fri Apr 17 2026
        time: dateToReadbleStr ? dateToReadbleStr : ' - ',
        title: item.title,
        url: item.url,
      };
      this.items.set(item.id, savedNews);
      this.notify({ noteType: 'add', news: savedNews });
    }
  }

  removeNews(id) {
    if (!this.items.has(id)) throw new Error("This news doesn't exist!");
    const item = this.items.get(id);
    this.items.delete(id);
    this.notify({ noteType: 'remove', news: item });
  }

  snapshot() {
    // ritorna una copia serializzabile degli elementi
    return Array.from(this.items.values());
  }
}
