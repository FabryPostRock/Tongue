export class safeStorage {
  /*
  The class manages exceptions in reading and writing storage and the parsing task safely
  */
  static GetFrom(storageClass, kStorage) {
    if (kStorage)
      try {
        return JSON.parse(storageClass.getItem(kStorage));
      } catch (err) {
        throw new Error('el parsing has generated an error!', err);
      }
    else {
      throw new Error('el parameter was null or undefined');
    }
  }

  static async SetTo(storageClass, kStorage, el) {
    if (el) {
      try {
        return await storageClass.setItem(kStorage, JSON.stringify(el));
      } catch (err) {
        throw new Error('el stringification has generated an error!', err);
      }
    } else {
      throw new Error('el parameter was null or undefined');
    }
  }

  constructor() {
    throw new Error('safeJSONLoad cannot be instantiated.');
  }
}
