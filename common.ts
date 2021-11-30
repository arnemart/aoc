import { readFileSync } from 'fs'

process.chdir(require.main.path)

export const inputLines = (splitWith: string | RegExp = /\n/) => readFileSync('input.txt').toString().split(splitWith)

export const fillArray = <T>(n: number, v: T = null): T[] => Array.from(Array(n)).map(_ => v)
export const range = (n1: number, n2?: number) => (n2 == undefined ? fillArray(n1).map((_, i) => i) : fillArray(n2 - n1).map((_, i) => i + n1))

type CF<A, B> = (a: A) => B
export function $<A>(v: A): A
export function $<A, B>(v: A, fn1: CF<A, B>): B
export function $<A, B, C>(v: A, fn1: CF<A, B>, fn2: CF<B, C>): C
export function $<A, B, C, D>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): D
export function $<A, B, C, D, E>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): E
export function $<A, B, C, D, E, F>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>): F
export function $<A, B, C, D, E, F, G>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>, fn6: CF<F, G>): G
export function $<A, B, C, D, E, F, G, H>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>, fn6: CF<F, G>, fn7: CF<G, H>): H
export function $(v: any, ...fns: CF<any, any>[]) {
  return fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export function pipe<A, B>(fn1: CF<A, B>): (v: A) => B
export function pipe<A, B, C>(fn1: CF<A, B>, fn2: CF<B, C>): (v: A) => C
export function pipe<A, B, C, D>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): (v: A) => D
export function pipe<A, B, C, D, E>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): (v: A) => E
export function pipe<A, B, C, D, E, F>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>): (v: A) => F
export function pipe<A, B, C, D, E, F, G>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>, fn6: CF<F, G>): (v: A) => G
export function pipe<A, B, C, D, E, F, G, H>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>, fn6: CF<F, G>, fn7: CF<G, H>): (v: A) => H
export function pipe<A>(...fns: CF<any, any>[]) {
  return (v: A) => fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

type MapFn<T, U> = (v: T, i: number, arr: T[]) => U

export const map =
  <T, U>(fn: MapFn<T, U>) =>
  (arr: T[]): U[] =>
    arr.map(fn)
export const forEach =
  <T>(fn: MapFn<T, void>) =>
  (arr: T[]): void =>
    arr.forEach(fn)
export const filter =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): T[] =>
    arr.filter(fn)
export const some =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): boolean =>
    arr.some(fn)
export const every =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): boolean =>
    arr.every(fn)
export const find =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): T =>
    arr.find(fn)
export const includes =
  <T>(v: T) =>
  (arr: T[]): boolean =>
    arr.includes(v)
export const reduce =
  <T, U>(fn: (agg: U, val: T, i: number, arr: T[]) => U, init: U) =>
  (arr: T[]): U =>
    arr.reduce(fn, init)
export const slice =
  <T>(start: number, end?: number) =>
  (arr: T[]): T[] =>
    arr.slice(start, end)
export const sum = (nums: number[]): number => nums.reduce((s, n) => s + n, 0)
export const product = (nums: number[]): number => nums.reduce((p, n) => p * n, 1)
export const zipWith =
  <T, U>(other: U[]) =>
  (arr: T[]): [T, U][] =>
    arr.map((v: T, i: number) => [v, other[i]])
export const first = <T>(arr: T[]): T => arr[0]
export const last = <T>(arr: T[]): T => arr[arr.length - 1]
export const int = (s: string): number => parseInt(s, 10)
export const ints = map(int)
export const float = (s: string): number => parseFloat(s)
export const floats = map(float)

export const spyWith =
  <T>(fn: (v: T) => unknown) =>
  (v: T): T => {
    fn(v)
    return v
  }
export const spy: <T>(v: T) => T = spyWith(console.log)
