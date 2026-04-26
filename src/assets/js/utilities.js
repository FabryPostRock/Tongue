export class safeStorage {
  /*
  The class manages exceptions in reading and writing storage and the parsing task safely
  */
  static getFrom(storageClass, kStorage) {
    if (
      storageClass &&
      kStorage &&
      Object.getPrototypeOf(storageClass) === Storage.prototype &&
      typeof kStorage === 'string'
    ) {
      try {
        return JSON.parse(storageClass.getItem(kStorage));
      } catch (err) {
        throw new Error(`el parsing has generated an error : ${err}`);
      }
    } else {
      throw new Error('One or more parameters missing in the function call');
    }
  }

  static async setTo(storageClass, kStorage, el) {
    if (
      storageClass &&
      kStorage &&
      (el != null || undefined) &&
      Object.getPrototypeOf(storageClass) === Storage.prototype &&
      typeof kStorage === 'string'
    ) {
      try {
        await storageClass.setItem(kStorage, JSON.stringify(el));
      } catch (err) {
        throw new Error(`el stringification has generated an error : ${err}`);
      }
    } else {
      throw new Error('One or more parameters missing in the function call');
    }
  }

  static clearStorage(storageClass) {
    try {
      if (storageClass && Object.getPrototypeOf(storageClass) === Storage.prototype) {
        storageClass.clear();
      } else {
        throw new Error('storageClass parameter is missing in the function call');
      }
    } catch (err) {
      throw new Error(`Clearing Storage generated and error : ${err}`);
    }
  }

  constructor() {
    throw new Error('safeStorage cannot be instantiated.');
  }
}
