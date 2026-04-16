import { Observable } from "./observers.js";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Observable base class", () => {
  let obs;
  const cb = vi.fn();
  const fakeArg = "test";
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
  it("subscribe KO: Verifica lancio exception con argomento che non è una funzione", () => {
    expect(() => obs.subscribe(fakeArg)).toThrow();
  });
  it("unsubscribe KO: Verifica lancio exception con argomento che non è una funzione", () => {
    expect(() => obs.unsubscribe(fakeArg)).toThrow();
  });
  it("notify OK: function execution without exceptions", () => {
    const data = { id: "1", name: "1" };
    const doSomething = vi.fn((data) => data);
    obs.subscribe(doSomething);
    expect(() => obs.notify(data)).not.toThrow();
    obs.unsubscribe(doSomething);
    //funziona solo se ho usato una funzione mockata vi.fn
    expect(doSomething).toHaveBeenCalledTimes(1);
  });
});
