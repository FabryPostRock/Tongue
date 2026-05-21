import { Observable, News } from './observable.js';
//
import * as newsDomModule from './observers.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// jsdom simulates browser environment therefore we can access document object
// @vitest-environment jsdom
describe('createNewsDomEl', () => {
  it('Return HTML with url OK: returns an html element with a button that opens an external page', () => {
    const item = {
      id: 2,
      by: 'Bob',
      score: 87,
      time: 'Fri Apr 17 2026',
      title: 'Seconda news',
      url: 'https://example.com/2',
      type: 'story',
    };

    // Ho dovuto importare il modulo intero per poter applicare spyOn
    const spy = vi.spyOn(newsDomModule, 'createNewsDomEl');
    const el = newsDomModule.createNewsDomEl(item);
    // verifica che non generi eccezione e ritorni con successo qualcosa
    expect(spy).toHaveReturned();
    expect(spy).toHaveReturnedWith(el);
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.querySelector('.news-extra')).toBeNull();
    expect(el.querySelector('a[target]')).not.toBeNull();
    expect(el.querySelector('a.btn.white.p-0.m-2.a-icon-hover')).not.toBeNull();
  });

  it('Return HTML without url OK: returns an html element with an expandible text', () => {
    const item = {
      id: 2,
      by: 'Bob',
      score: 87,
      time: 'Fri Apr 17 2026',
      title: 'Seconda news',
      text: 'Contenuto della news',
      type: 'story',
    };

    // Ho dovuto importare il modulo intero per poter applicare spyOn
    const spy = vi.spyOn(newsDomModule, 'createNewsDomEl');
    const el = newsDomModule.createNewsDomEl(item);
    // verifica che non generi eccezione e ritorni con successo qualcosa
    expect(spy).toHaveReturned();
    expect(spy).toHaveReturnedWith(el);
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.querySelector('.news-extra')).not.toBeNull();
    expect(el.querySelector('a[target]')).toBeNull();
    expect(el.querySelector('a.btn.white.p-0.m-2.a-icon-hover')).not.toBeNull();
  });

  it('Return HTML without url and descriptive text OK: returns an html element without any link to external page', () => {
    const item = {
      id: 2,
      by: 'Bob',
      score: 87,
      time: 'Fri Apr 17 2026',
      title: 'Seconda news',
      type: 'story',
    };

    // Ho dovuto importare il modulo intero per poter applicare spyOn
    const spy = vi.spyOn(newsDomModule, 'createNewsDomEl');
    const el = newsDomModule.createNewsDomEl(item);
    // verifica che non generi eccezione e ritorni con successo qualcosa
    expect(spy).toHaveReturned();
    expect(spy).toHaveReturnedWith(el);
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.querySelector('.news-extra')).toBeNull();
    expect(el.querySelector('a[target]')).toBeNull();
    expect(el.querySelector('a.btn.white.p-0.m-2.a-icon-hover')).not.toBeNull();
  });

  it("Throw ERROR : L'elemento passato nei parametri non è di tipo Object", () => {
    const item = 'fake object';
    expect(() => newsDomModule.createNewsDomEl(item)).toThrow();
  });
});

describe('renderNewsChange', () => {
  let n;
  beforeEach(() => {
    n = new News();
  });
  it('Function exec OK: renderNewsChange implementa senza errori tutti i metodi della classe observable', () => {
    const item = {
      id: 2,
      by: 'Bob',
      score: 87,
      time: 'Fri Apr 17 2026',
      title: 'Seconda news',
      url: 'https://example.com/2',
      type: 'story',
    };
    expect(() => n.subscribe(newsDomModule.renderNewsChange)).not.toThrow();
    expect(() => n.addNews(item)).not.toThrow();
    expect(() => n.removeNews(item.id)).not.toThrow();
  });

  it("Fake Id KO : renderNewsChange restituisce errore se l' id non è corretto", () => {
    const item = {
      id: 2,
      by: 'Bob',
      score: 87,
      time: 'Fri Apr 17 2026',
      title: 'Seconda news',
      url: 'https://example.com/2',
      type: 'story',
    };
    const fakeId = 1233;
    n.subscribe(newsDomModule.renderNewsChange);
    n.addNews(item);
    expect(() => n.removeNews(fakeId)).toThrow();
  });
});
