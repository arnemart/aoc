import { readFileSync } from 'fs'

process.chdir(require.main.path)

export const readInput = (testInput: string = null) => testInput ?? readFileSync('input.txt').toString()

export const fillArray = <T>(n: number, v: T = null): T[] => Array.from(Array(n)).map(_ => v)
export const range = (l: number) => fillArray(l).map((_, i) => i)
export const loopUntil = <T>(
  fn: (i: number, result: T) => T | null,
  cond = (v: T) => v != null,
  initialValue: T = null
): T => {
  let result: T
  let prevResult: T = initialValue
  let i = 0
  do {
    result = fn(i++, prevResult)
    prevResult = result
  } while (!cond(result))
  return result
}

type CF<A, B> = (a: A) => B
export function $<A>(v: A): A
export function $<A, B>(v: A, fn1: CF<A, B>): B
export function $<A, B, C>(v: A, fn1: CF<A, B>, fn2: CF<B, C>): C
export function $<A, B, C, D>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): D
export function $<A, B, C, D, E>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): E
export function $<A, B, C, D, E, F>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>): F
export function $<A, B, C, D, E, F, G>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>
): G
export function $<A, B, C, D, E, F, G, H>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>
): H
export function $(v: any, ...fns: CF<any, any>[]) {
  return fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export function pipe<A, B>(fn1: CF<A, B>): (v: A) => B
export function pipe<A, B, C>(fn1: CF<A, B>, fn2: CF<B, C>): (v: A) => C
export function pipe<A, B, C, D>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): (v: A) => D
export function pipe<A, B, C, D, E>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): (v: A) => E
export function pipe<A, B, C, D, E, F>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>
): (v: A) => F
export function pipe<A, B, C, D, E, F, G>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>
): (v: A) => G
export function pipe<A, B, C, D, E, F, G, H>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>
): (v: A) => H
export function pipe<A>(...fns: CF<any, any>[]) {
  return (v: A) => fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export const isNull = <T>(v: T): boolean => v == null
export const not =
  <T>(fn: (v: T) => boolean) =>
  (v: T): boolean =>
    !fn(v)

type MapFn<T, U> = (v: T, i: number, arr: T[]) => U

export const map =
  <T, U>(fn: MapFn<T, U>) =>
  (arr: T[]): U[] =>
    arr.map(fn)
export const reduce =
  <T, U>(fn: (agg: U, val: T, i: number, arr: T[]) => U, init: U) =>
  (arr: T[]): U =>
    arr.reduce(fn, init)
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
export const slice =
  <T>(start: number, end?: number) =>
  (arr: T[]): T[] =>
    arr.slice(start, end)
export const indexOf =
  <T>(v: T) =>
  (arr: T[]): number =>
    arr.indexOf(v)
export const shift =
  <T>(distance: number) =>
  (arr: T[]) =>
    distance > 0
      ? [...$(arr, slice(-distance)), ...$(arr, slice(0, arr.length - distance))]
      : [...$(arr, slice(-distance)), ...$(arr, slice(0, -distance))]
export const concat =
  <T>(other: T[]) =>
  (arr: T[]): T[] =>
    arr.concat(other)

export function zipWith<A, B>(o1: B[]): (a: A[]) => [A, B][]
export function zipWith<A, B, C>(o1: B[], o2: C[]): (a: A[]) => [A, B, C][]
export function zipWith<A, B, C, D>(o1: B[], o2: C[], o3: D[]): (a: A[]) => [A, B, C, D][]
export function zipWith<T>(...others: unknown[]) {
  return (arr: T[]) =>
    $(
      arr,
      map((v, i) => [
        v,
        ...$(
          others,
          map(o => o[i])
        )
      ])
    )
}

export const first = <T>(arr: T[]): T => arr[0]
export const last = <T>(arr: T[]): T => arr[arr.length - 1]
export const length = <T>(arr: T[] | string): number => arr.length

export const frequencies = <T>(arr: T[]): Map<T, number> =>
  $(
    arr,
    reduce((freqs: Map<T, number>, e: T) => freqs.set(e, (freqs.get(e) || 0) + 1), new Map<T, number>())
  )

export const sort =
  <T>(fn?: (a: T, b: T) => number) =>
  (arr: T[]): T[] =>
    fn ? arr.sort(fn) : arr.sort()
export const sortNumeric =
  ({ reverse }: { reverse: boolean } = { reverse: false }) =>
  (arr: number[]): number[] =>
    arr.sort((a: number, b: number) => (reverse ? b - a : a - b))

export const flatten =
  <T, A extends Array<T>, D extends number = 1>(depth?: D) =>
  (arr: A): FlatArray<A, D>[] =>
    arr.flat(depth)

export const without =
  <T>(v: T) =>
  (arr: T[]): T[] =>
    $(arr, includes(v)) ? [...$(arr, slice(0, arr.indexOf(v))), ...$(arr, slice(arr.indexOf(v) + 1))] : arr

export const permutations =
  <T>(n: number = null) =>
  (arr: T[]): T[][] => {
    if (n == null) {
      n = arr.length
    }
    return n == 1
      ? $(
          arr,
          map(a => [a])
        )
      : $(
          arr.map(v =>
            $(
              arr,
              without(v),
              permutations(n - 1),
              map(a => [v, ...a])
            )
          ),
          flatten()
        )
  }

export const uniquePermutations =
  <T>(n: number) =>
  (arr: T[]): T[][] =>
    n == 1
      ? $(
          arr,
          map(a => [a])
        )
      : $(
          arr,
          first,
          v => [
            $(
              arr,
              slice(1),
              uniquePermutations(n - 1),
              map(a => [v, ...a])
            ),
            arr.length <= n ? [] : $(arr, slice(1), uniquePermutations(n))
          ],
          flatten()
        )

export const uniqueCombinations =
  <T>(count: number) =>
  (vals: T[]): T[][] =>
    vals.length == 1
      ? [fillArray(count, vals[0])]
      : $(
          range(count),
          map(n =>
            $(
              $(vals, slice(1)),
              uniqueCombinations(count - n),
              map(comb => [...fillArray(n, vals[0]), ...comb])
            )
          ),
          flatten(),
          concat([fillArray(count, vals[0])])
        )

export const sum = (nums: number[]): number => nums.reduce((s, n) => s + n, 0)
export const product = (nums: number[]): number => nums.reduce((p, n) => p * n, 1)
export const floor = (num: number): number => Math.floor(num)
export const max: (nums: number[]) => number = pipe(sortNumeric(), last)
export const min = (nums: number[]): number => Math.min(...nums)
export const add =
  (n1: number) =>
  (n2: number): number =>
    n1 + n2
export const mod =
  (n1: number) =>
  (n2: number): number =>
    n2 % n1
export const clamp =
  (min: number, max: number) =>
  (n: number): number =>
    Math.max(Math.min(n, max), min)

export function pluck<T, K extends keyof T>(key: K): (o: T) => T[K]
export function pluck<T, K extends keyof T>(keys: K[]): (o: T) => T[K][]
export function pluck<T, K extends keyof T>(keys: K | K[]) {
  if (keys instanceof Array) {
    return (o: T) =>
      $(
        keys as K[],
        map(key => o[key])
      )
  } else {
    return (o: T) => o[keys as K]
  }
}

export const getIn =
  (...keys: (string | number)[]) =>
  (val: any[] | { [key: string]: any }): any =>
    keys.reduce((o, key) => (o && o[key] ? o[key] : null), val)

export const setIn =
  (keys: (string | number)[], val: any) =>
  (o: any[] | { [key: string]: any }): any => {
    o[keys[0]] = $(keys, length, is(1)) ? val : $(o[keys[0]], setIn($(keys, slice(1)), val))
    return o
  }

export function values<K, V>(m: { [key: string]: V } | Map<K, V> | Set<V>) {
  if (m instanceof Map || m instanceof Set) return Array.from(m.values())
  return Object.values(m)
}

export function keys<K, V>(m: Map<K, V>): K[]
export function keys<V>(m: { [key: string]: V }): string[]
export function keys(m: any): any {
  if (m instanceof Array) return range(m.length)
  if (m instanceof Map) return Array.from(m.keys())
  return Object.keys(m)
}

export function entries<K, V>(m: Map<K, V>): [K, V][]
export function entries<V>(m: { [key: string]: V }): [string, V][]
export function entries(m: any): any {
  if (m instanceof Map) return Array.from(m.entries())
  return Object.entries(m)
}

export const int = (s: string): number => parseInt(s, 10)
export const ints = map(int)
export const float = (s: string): number => parseFloat(s)
export const floats = map(float)
export const split =
  (sep: RegExp | string = '') =>
  (s: string): string[] =>
    s.split(sep)
export const join =
  <T>(joinWith: string = '') =>
  (arr: T[]): string =>
    arr.join(joinWith)
export const lines = split('\n')
export const match =
  (reg: RegExp) =>
  (s: string): RegExpMatchArray =>
    s.match(reg)
export const test =
  (reg: RegExp) =>
  (s: string): boolean =>
    reg.test(s)
export const charAt =
  (n: number) =>
  (s: string): string =>
    s.charAt(n)

export const parse =
  <T>(reg: RegExp, parser: (matches: RegExpMatchArray) => T) =>
  (input: string): T[] =>
    $(
      input,
      lines,
      map(line => {
        const matches = $(line, match(reg))
        if (!matches) {
          throw new Error(`No match for input: ${line}`)
        }
        return parser(matches)
      })
    )

export const intoSet = <T>(val: T[]): Set<T> => new Set(val)
export const union = <T>(sets: Set<T>[]): Set<T> =>
  $(
    sets,
    map(set => Array.from(set)),
    flatten(),
    intoSet
  )

export const cond =
  <T, U>(o: [T | T[], U | ((v: T) => U)][], def?: U) =>
  (v: T): U => {
    const hit = o.find(e => (e[0] instanceof Array ? e[0].some(ee => ee == v) : e[0] == v))
    if (!hit && def !== undefined) {
      return def
    } else if (!hit && def === undefined) {
      throw new Error(`Missing condition: ${v}`)
    }
    if (hit[1] instanceof Function) {
      return hit[1](v)
    } else {
      return hit[1]
    }
  }
export const is = <T>(...v: T[]) => cond([[v, true]], false)

export const repeat =
  <T>(n: number, fn: (v: T) => T) =>
  (v: T): T =>
    $(
      range(n),
      reduce(v => fn(v), v)
    )

export const spyWith =
  <T>(fn: (v: T) => unknown) =>
  (v: T): T => {
    fn(v)
    return v
  }
export const spy: <T>(v: T) => T = spyWith(console.log)
