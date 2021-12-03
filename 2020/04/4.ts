import { $, every, filter, int, keys, map, pipe, readInput, split, within } from '../../common'

const checkHgt = (v: string): boolean => {
  const matches = v.match(/^(\d+)(in|cm)$/)
  if (matches && matches[2] == 'cm') return $(matches[1], int, within(150, 193))
  else if (matches && matches[2] == 'in') return $(matches[1], int, within(59, 76))
  return false
}

const rules: { [key: string]: (v: string) => boolean } = {
  byr: pipe(int, within(1920, 2002)),
  iyr: pipe(int, within(2010, 2020)),
  eyr: pipe(int, within(2020, 2030)),
  hgt: checkHgt,
  hcl: v => /^#[0-9a-f]{6}/i.test(v),
  ecl: v => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(v),
  pid: v => /^\d{9}$/.test(v) /*,
  cid: ignore*/
}

const reqFields = $(rules, keys)

type PP = Map<string, string>

const input: PP[] = $(
  readInput(),
  split(/\n\n/),
  map(pipe(split(/\s+/), map(split(':')), (p: [string, string][]) => new Map(p)))
)

const valid1 = (pp: PP): boolean => $(reqFields, every(pp.has.bind(pp)))
const valid2 = (pp: PP): boolean =>
  $(
    reqFields,
    every(key => rules[key](pp.get(key)))
  )

const part1valid = $(input, filter(valid1))
const part2valid = $(part1valid, filter(valid2))

console.log('Part 1:', part1valid.length)
console.log('Part 2:', part2valid.length)
