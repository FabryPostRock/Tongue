import { Observable, News } from './observable.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Observable base class', () => {
  let obs;
  const cb = vi.fn();
  const fakeArg = 'test';
  beforeEach(() => {
    obs = new Observable();
  });

  it("subscribe OK: Verifica ignore exception se l'argomento è una funzione", () => {
    expect(() => obs.subscribe(cb)).not.toThrow();
  });
  it("unsubscribe OK: Verifica ignore exception se l'argomento è una funzione", () => {
    obs.subscribe(cb);
    expect(() => obs.unsubscribe(cb)).not.toThrow();
  });
  it('subscribe KO: Verifica lancio exception con argomento che non è una funzione', () => {
    expect(() => obs.subscribe(fakeArg)).toThrow();
  });
  it('unsubscribe KO: Verifica lancio exception con argomento che non è una funzione', () => {
    expect(() => obs.unsubscribe(fakeArg)).toThrow();
  });
  it('notify OK: function execution without exceptions', () => {
    const data = { id: '1', name: '1' };
    const doSomething = vi.fn((data) => data);
    obs.subscribe(doSomething);
    expect(() => obs.notify(data)).not.toThrow();
    obs.unsubscribe(doSomething);
    //funziona solo se ho usato una funzione mockata vi.fn
    expect(doSomething).toHaveBeenCalledTimes(1);
  });
});

describe('News Observable class', () => {
  let n;
  const observers = [vi.fn(), vi.fn()];

  beforeEach(() => {
    n = new News();
  });

  it('news add OK: data processed without exceptions', () => {
    const item = {
      id: 47777174,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249464,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    expect(() => n.addNews(item)).not.toThrow();
    const savedItem = n.items.get(item.id);
    expect(typeof savedItem.id).toEqual('number');
    expect(savedItem.id).toEqual(47777174);
    expect(typeof savedItem.by).toEqual('string');
    expect(savedItem.by).toEqual('fredrikaverpil');
    expect(typeof savedItem.score).toEqual('number');
    expect(savedItem.score).toEqual(11);
    expect(typeof savedItem.time).toEqual('string');
    expect(savedItem.time).toEqual('Wed Apr 15 2026');
    expect(typeof savedItem.title).toEqual('string');
    expect(savedItem.title).toEqual('Title 1');
    expect(savedItem.url).toEqual('https://fake/url');
    expect(typeof savedItem.url).toEqual('string');
  });
  it('news add OK: conversione date time non in formato Unix senza errori', () => {
    const item = {
      id: 47777174,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249466211,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    expect(() => n.addNews(item)).not.toThrow();
    const savedItem = n.items.get(item.id);
    expect(typeof savedItem.time).toEqual('string');
    expect(savedItem.time).toEqual('Wed Apr 15 2026');
  });
  it('news add KO: manca il parametro id', () => {
    const item = {
      id: null,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249464,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    expect(() => n.addNews(item)).toThrow();
  });
  it('news add KO: trying to add duplicate', () => {
    const item = {
      id: 47777174,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249464,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    n.addNews(item);
    expect(() => n.addNews(item)).toThrow();
  });

  it('news remove OK: news removed successfully', () => {
    const item = {
      id: 47777174,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249464,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    n.addNews(item);
    expect(() => n.removeNews(item.id)).not.toThrow();
  });
  it("news remove KO: generate error if id don't exist", () => {
    const item = {
      id: 47777174,
      by: 'fredrikaverpil',
      score: 11,
      time: 1776249464,
      title: 'Title 1',
      type: 'story',
      url: 'https://fake/url',
    };
    const fakeId = 111;
    n.subscribe(observers[0]);
    n.subscribe(observers[1]);
    n.addNews(item);
    expect(() => n.removeNews(fakeId)).toThrow();
  });
});
