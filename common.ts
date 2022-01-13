import { readFileSync } from 'fs'
export const clone = require('rfdc')()

process.chdir(require.main.path)

export const readInput = (testInput: string = null, useTestInput: boolean = true) =>
  testInput && useTestInput ? testInput : readFileSync('input.txt').toString()

export const id = <T>(v: T) => v

export const xor = (a: boolean, b: boolean) => (a && !b) || (!a && b)
export const range = (n1: number, n2?: number) =>
  n2 == undefined
    ? Array.from(Array(n1)).map((_, i) => i)
    : n1 >= n2
    ? []
    : Array.from(Array(n2 - n1)).map((_, i) => i + n1)

export const inclusiveRange = (n1: number, n2: number) => (n2 > n1 ? range(n1, n2 + 1) : range(n2, n1 + 1).reverse())

export function fillArray<T>(n: number, v?: T | ((i: number) => T)): T[]
export function fillArray<T>(n: [number, number], v?: T | ((i: number) => T)): T[][]
export function fillArray<T>(n: number | [number, number], v: T | ((i: number) => T) = null): T[] | T[][] {
  return n instanceof Array
    ? $(
        range(n[1]),
        map(i =>
          $(
            range(n[0]),
            map(i => (v instanceof Function ? v(i) : v))
          )
        )
      )
    : $(
        range(n),
        map(i => (v instanceof Function ? v(i) : v))
      )
}

export const memoize = <A, B>(fn: (v: A) => B) => {
  const memos = new Map<A, B>()
  return (v: A): B => {
    if (!memos.has(v)) {
      memos.set(v, fn(v))
    }
    return memos.get(v)
  }
}

export const loopUntil = <T>(
  fn: (i: number, result: T) => T | null,
  cond = (v: T) => v != null,
  initialValue: T = null,
  startAt = 0
): T => {
  let result: T
  let prevResult: T = initialValue
  let i = startAt
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
export function $<A, B, C, D, E, F, G, H, I>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>,
  fn8: CF<H, I>
): I
export function $<A, B, C, D, E, F, G, H, I, J>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>,
  fn8: CF<H, I>,
  fn9: CF<I, J>
): J
export function $<A, B, C, D, E, F, G, H, I, J, K>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>,
  fn8: CF<H, I>,
  fn9: CF<I, J>,
  fn10: CF<J, K>
): K
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
export function pipe<A, B, C, D, E, F, G, H, I>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>,
  fn8: CF<H, I>
): (v: A) => I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>,
  fn8: CF<H, I>,
  fn9: CF<I, J>
): (v: A) => J
export function pipe<A>(...fns: CF<any, any>[]) {
  return (v: A) => fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export function tee<T, A, B>(fn1: CF<T, A>, fn2: CF<T, B>): (v: T) => [A, B]
export function tee<T, A, B, C>(fn1: CF<T, A>, fn2: CF<T, B>, fn3: CF<T, C>): (v: T) => [A, B, C]
export function tee<T, A, B, C, D>(fn1: CF<T, A>, fn2: CF<T, B>, fn3: CF<T, C>, fn4: CF<T, D>): (v: T) => [A, B, C, D]
export function tee<T, U>(...cmds: ((v: T) => U)[]): (v: T) => U[]
export function tee<T>(...cmds: ((v: T) => unknown)[]): (v: T) => unknown[] {
  return (v: T) =>
    $(
      cmds,
      map(cmd => cmd(v))
    )
}

export const not =
  <T>(fn: (v: T) => boolean) =>
  (v: T): boolean =>
    !fn(v)

export const isNull = <T>(v: T): boolean => v == null
export const nonNull = not(isNull)

// ARRAY STUFF
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
export const takeUntilInclusive =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): T[] =>
    $(
      arr,
      reduce(
        ({ res, done }, v, i, arr) => {
          if (done) {
            return { res, done }
          }
          res.push(v)
          return { res, done: fn(v, i, arr) }
        },
        { res: [], done: false }
      )
    ).res
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
export const findIndex =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): number =>
    arr.findIndex(fn)
export const findWithContext =
  <T, U>(callback: (value: T, i: number) => [found: boolean, context: U]) =>
  (arr: T[]): [value: T, context: U] | undefined => {
    for (const { v, i } of $(
      arr,
      map((v, i) => ({ v, i }))
    )) {
      const [found, context] = callback(v, i)
      if (found) {
        return [v, context]
      }
    }
  }
export const includes =
  <T>(v: T) =>
  (arr: T[]): boolean =>
    arr.includes(v)
export const isIn =
  <T>(arr: T[]) =>
  (v: T): boolean =>
    arr.includes(v)
export const slice =
  <T>(start: number, end?: number) =>
  (arr: T[]): T[] =>
    arr.slice(start, end)
export const indexOf =
  <T>(v: T) =>
  (arr: T[]): number =>
    arr.indexOf(v)
export const lastIndexOf =
  <T>(v: T) =>
  (arr: T[]): number =>
    arr.lastIndexOf(v)
export const shift =
  <T>(distance: number) =>
  (arr: T[]) => {
    const dist = distance % arr.length
    return dist > 0
      ? [...$(arr, slice(-dist)), ...$(arr, slice(0, arr.length - dist))]
      : [...$(arr, slice(-dist)), ...$(arr, slice(0, -dist))]
  }
export const push =
  <T>(other: T | T[]) =>
  (arr: T | T[]): T[] =>
    (arr instanceof Array ? arr : [arr]).concat(other)
export const unshift =
  <T>(arr: T | T[]) =>
  (other: T | T[]): T[] =>
    (arr instanceof Array ? arr : [arr]).concat(other)
export const chop =
  <T>(n: number) =>
  (arr: T[]): T[][] =>
    $(
      range(Math.ceil(arr.length / n)),
      map(i => arr.slice(i * n, Math.min((i + 1) * n, arr.length)))
    )

export const arrEqual =
  <T>(s1: T[]) =>
  (s2: T[]) =>
    s1.length == s2.length &&
    $(
      s1,
      every((v, i) => s2[i] == v)
    )
export const arrSameValues =
  <T>(s1: T[]) =>
  (s2: T[]) =>
    s1.length == s2.length &&
    $(
      s1,
      every(v => $(s2, includes(v)))
    )

export const allEqual = <T>([v, ...rest]: T[]): boolean => $(rest, every(is(v)))

export function zipWith<A, B>(o1: B[]): (a: A[]) => [A, B][]
export function zipWith<A, B, C>(o1: B[], o2: C[]): (a: A[]) => [A, B, C][]
export function zipWith<A, B, C, D>(o1: B[], o2: C[], o3: D[]): (a: A[]) => [A, B, C, D][]
export function zipWith<T>(...others: T[][]): (a: T[]) => T[][]
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

export function zip<A, B>(arrs: [A[], B[]]): [A, B][]
export function zip<A, B, C>(arrs: [A[], B[], C[]]): [A, B, C][]
export function zip<A, B, C, D>(arrs: [A[], B[], C[], D[]]): [A, B, C, D][]
export function zip<T>(arrs: T[][]): T[][]
export function zip([first, ...rest]: unknown[][]): unknown[][] {
  return $(first, zipWith(...rest))
}

export const first = <T>(arr: T[]): T => arr[0]
export const last = <T>(arr: T[]): T => arr[arr.length - 1]
export const nth =
  <T>(n: number) =>
  (arr: T[]): T =>
    n < 0 ? arr[arr.length + n] : arr[n]
export const length = <T>(arr: T[] | string): number => arr.length
export const count =
  <T>(fn: (v: T) => boolean) =>
  (arr: T[]) =>
    arr.filter(fn).length

export const frequencies = <T>(arr: T[]): Map<T, number> =>
  $(
    arr,
    reduce((freqs: Map<T, number>, e: T) => freqs.set(e, (freqs.get(e) || 0) + 1), new Map<T, number>())
  )

export const mostCommon = <T>(arr: T[]): T =>
  Array.from(frequencies(arr).entries()).sort((a: [T, number], b: [T, number]) => b[1] - a[1])[0][0]

export const leastCommon = <T>(arr: T[]): T =>
  Array.from(frequencies(arr).entries()).sort((a: [T, number], b: [T, number]) => a[1] - b[1])[0][0]

export const sort =
  <T>(fn?: (a: T, b: T) => number) =>
  (arr: T[]): T[] =>
    fn ? arr.sort(fn) : arr.sort()
export const sortNumeric =
  ({ reverse }: { reverse: boolean } = { reverse: false }) =>
  (arr: number[]): number[] =>
    [...arr].sort((a: number, b: number) => (reverse ? b - a : a - b))
export const sortBy =
  <T>(fn: (v: T) => number) =>
  (arr: T[]): T[] =>
    arr.sort((a, b) => fn(a) - fn(b))

export const reverse = <T>(a: T[]): T[] => a.slice().reverse()

export const flatten =
  <T, A extends Array<T>, D extends number = 1>(depth?: D) =>
  (arr: A): FlatArray<A, D>[] =>
    arr.flat(depth)

export const flatmap =
  <T, U>(fn: MapFn<T, U[]>) =>
  (arr: T[]): U[] =>
    $(arr, map(fn), flatten())

export const without =
  <T>(vs: T | T[]) =>
  (arr: T[]): T[] =>
    $(
      vs instanceof Array ? vs : [vs],
      reduce(
        (arr, v) =>
          $(arr, includes(v)) ? [...$(arr, slice(0, arr.indexOf(v))), ...$(arr, slice(arr.indexOf(v) + 1))] : arr,
        arr
      )
    )

export const overlap =
  <T>(a1: T[]) =>
  (a2: T[]): T[] =>
    $(
      a1,
      filter(v => $(a2, includes(v)))
    )

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

export const combinations =
  <T>(k: number) =>
  (a: T[]): T[][] =>
    k > 1
      ? $(
          a,
          combinations(k - 1),
          map(l =>
            $(
              a,
              map(n => [...l, n])
            )
          ),
          flatten()
        )
      : $(
          a,
          map(n => [n])
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
          push([fillArray(count, vals[0])])
        )

// NUMBER STUFF
export const toString =
  (radix = 10) =>
  (v: number) =>
    v.toString(radix)
export const sum = (nums: number[]): number => nums.reduce((s, n) => s + n, 0)
export const difference = ([a, b]: number[]): number => abs(a - b)
export const product = (nums: number[]): number => nums.reduce((p, n) => p * n, 1)
export const floor = (num: number): number => Math.floor(num)
export const ceil = (num: number): number => Math.ceil(num)
export const round = (num: number): number => Math.round(num)
export const sqrt = (num: number): number => Math.sqrt(num)
export const max: (nums: number[]) => number = pipe(sortNumeric(), last)
export const min = (nums: number[]): number => Math.min(...nums)
export const abs = (num: number): number => Math.abs(num)
export const median = (nums: number[]): number => nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)]
export const add =
  (n1: number) =>
  (n2: number): number =>
    n1 + n2
export const subtract =
  (n1: number) =>
  (n2: number): number =>
    n2 - n1
export const mult =
  (n1: number) =>
  (n2: number): number =>
    n1 * n2
export const div =
  (n1: number) =>
  (n2: number): number =>
    n2 / n1
export const intdiv =
  (n1: number) =>
  (n2: number): number =>
    Math.floor(n2 / n1)
export const mod =
  (n1: number) =>
  (n2: number): number =>
    n2 % n1
export const clamp =
  (min: number, max: number) =>
  (n: number): number =>
    Math.max(Math.min(n, max), min)
export const within =
  (min: number, max: number) =>
  (n: number): boolean =>
    n != null && n >= min && n <= max
export const even = (n: number): boolean => n % 2 == 0
export const odd = (n: number): boolean => n % 2 != 0

export const gt = (n1: number) => (n2: number) => n2 > n1
export const lt = (n1: number) => (n2: number) => n2 < n1
export const gte = (n1: number) => (n2: number) => n2 >= n1
export const lte = (n1: number) => (n2: number) => n2 <= n1

// OBJECT STUFF
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

export const pluckFrom =
  <T, K extends keyof T>(o: T) =>
  (key: K) =>
    o[key]

type Nested<T> = T[] | Nested<T>[] | { [key: string]: T } | { [key: string]: Nested<T> }

export const getIn =
  (...keys: (string | number)[]) =>
  (o: any[] | { [key: string]: any }): any =>
    keys.reduce((o, key) => {
      if (o) {
        return o instanceof Map ? o.get(key) : o[key]
      }
      return null
    }, o)

export const getInDefault =
  <T>(keys: (string | number)[], def: T) =>
  (o: Nested<T>): T => {
    const v = $(o, getIn(...keys))
    return v == null ? def : v
  }

export const get =
  <T>(key: string | number, defaultValue?: T) =>
  (o: any[] | { [key: string]: any }): any => {
    const v = $(o, getIn(key))
    return v != null ? v : defaultValue
  }

export const setIn =
  <T, U>(keys: (string | number)[], val: T | ((v: T) => T)) =>
  (o: any[] | { [key: string]: any }): U => {
    const oldVal = o instanceof Map ? o.get(keys[0]) : o[keys[0]]
    const newVal = $(keys, length, is(1))
      ? val instanceof Function
        ? val(oldVal)
        : val
      : $(oldVal, setIn($(keys, slice(1)), val))
    o instanceof Map ? o.set(keys[0], newVal) : (o[keys[0]] = newVal)
    return o as U
  }

export const set =
  <T, U>(key: string | number, val: T | ((v: T) => T)) =>
  (o: any[] | { [key: string]: any }): U =>
    $(o, setIn([key], val))

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
export function entries<V>(m: Record<string, V>): [string, V][]
export function entries(m: any) {
  return m instanceof Map ? Array.from(m.entries()) : Object.entries(m)
}

export const mapEntries = <K, V>(m: Map<K, V>): [K, V][] => Array.from(m.entries())

// STRING STUFF
export const number =
  (radix: number = 10) =>
  (s: string): number =>
    parseInt(s, radix)
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
export const matchAll =
  (reg: RegExp) =>
  (s: string): RegExpMatchArray[] =>
    Array.from(s.matchAll(reg))
export const matchAllOverlapping =
  (reg: RegExp) =>
  (s: string): RegExpMatchArray[] =>
    $(
      range(0, s.length - 1),
      reduce((allMatches, n) => {
        const matches = s.slice(n).match(reg)
        if (matches) {
          matches.index = matches.index + n
          if (allMatches.length == 0 || $(allMatches, last).index != matches.index) {
            allMatches.push(matches)
          }
        }
        return allMatches
      }, [] as RegExpMatchArray[])
    )
export const test =
  (reg: RegExp) =>
  (s: string): boolean =>
    reg.test(s)
export const numeric = (v: any) => (v == null ? false : $(v.toString(), test(/^-?\d+(\.\d+)?/)))
export const charAt =
  (n: number) =>
  (s: string): string =>
    s.charAt(n)
export const chars = (s: string) => s.replace(/\n/g, '').split('')
export function replace(fnd: RegExp | string, rep: string): (s: string) => string
export function replace(fnd: RegExp | string, rep: (substring: string, ...args: any[]) => string): (s: string) => string
export function replace(fnd: RegExp | string, rep: any = '') {
  return (s: string): string => s.replace(fnd, rep)
}
export const trim = (s: string) => s.trim()
export const leftPad =
  (length: number, padWith: string) =>
  (s: string): string =>
    Array.from(Array(Math.max(0, length - s.length + 1))).join(padWith) + s
export const substr =
  (start: number, end?: number) =>
  (str: string): string =>
    str.slice(start, end)
export const replaceIndex =
  (start: number, length: number, what: string) =>
  (where: string): string =>
    $([$(where, substr(0, start)), what, $(where, substr(start + length))], join())
export const allIndexesOf =
  (what: string) =>
  (where: string): number[] =>
    $(
      range(0, where.length - what.length + 1),
      filter(n => where.slice(n, n + what.length) == what)
    )

// OTHER STUFF
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

export const next =
  <T>(i: number, amt: number = 1) =>
  (arr: T[]): T =>
    arr[(i + arr.length + (amt % arr.length)) % arr.length]

export const intoSet = <T>(val: T[]): Set<T> => new Set(val)
export const unique = pipe(intoSet, values)
export const uniqueBy =
  <T, U>(fn: (v: T) => U) =>
  (arr: T[]): T[] =>
    $(
      arr,
      map(v => [fn(v), v] as [U, T]),
      e => new Map(e),
      values
    )
export const union = <T>(sets: Set<T>[]): Set<T> =>
  $(
    sets,
    map(set => Array.from(set)),
    flatten(),
    intoSet
  )

export const cond =
  <T, U>(o: [T | T[] | ((v: T) => boolean), U | ((v: T) => U)][], def?: U | ((v: T) => U)) =>
  (v: T): U => {
    const hit = o.find(e =>
      e[0] instanceof Array ? e[0].some(ee => ee == v) : e[0] instanceof Function ? e[0](v) : e[0] == v
    )
    if (!hit && def !== undefined) {
      return def instanceof Function ? def(v) : def
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

export const and =
  <T>(...fns: ((v: T) => boolean)[]) =>
  (v: T) =>
    $(
      fns,
      slice(1),
      reduce((t, fn) => t && fn(v), fns[0](v))
    )

export const or =
  <T>(...fns: ((v: T) => boolean)[]) =>
  (v: T) =>
    $(
      fns,
      slice(1),
      reduce((t, fn) => t || fn(v), fns[0](v))
    )

export const repeat =
  <T>(n: number, fn: (v: T, i?: number) => T) =>
  (v: T): T =>
    $(
      range(n),
      reduce((v, i) => fn(v, i), v)
    )

export const spyWith =
  <T>(fn: (v: T) => any) =>
  (v: T): T => {
    console.log(fn(v))
    return v
  }
export const spy: <T>(v: T) => T = spyWith(id)

export const printGrid = <T>(d: T[][]): T[][] => {
  $(d, map(pipe(map(pipe(Boolean, cond([[true, '0']], ' '))), join())), join('\n'), spy)
  return d
}

import crypto = require('crypto')
export const md5 = (val: string) => crypto.createHash('md5').update(val).digest('hex')
