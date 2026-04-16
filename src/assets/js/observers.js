export class Observable {
  constructor() {
    this.observers = new Set();
  }

  #subscribeChecks(fn) {
    if (typeof fn !== "function")
      throw new TypeError("The observer is not a function");
  }

  #unsubscribeChecks(fn) {
    this.#subscribeChecks(fn);
    if (!this.observers.has(fn))
      throw new Error(
        "This observer can't be subscribed because it's not in the subscribers list",
      );
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
        console.error("Observer error:", err);
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
    if (!item || !item.id || !item.by || !item.url || !item.title) {
      throw new TypeError("item deve avere id e by url e title");
    }
    const el = this.items.get(item.id);
    if (el) {
      throw new Error("This News already exists!");
    } else {
      this.items.set(item.id, {
        id: item.id,
        by: item.by,
        url: item.url,
        title: item.title,
      });
    }
  }

  removeNews() {}
}
