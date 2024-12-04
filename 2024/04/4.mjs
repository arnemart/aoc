import { readFileSync } from 'fs'

const input = readFileSync('./input.txt').toString()

const r = fn => [...Array(input.split('\n')[0].length)].map(fn)

const regs1 = [
  'XMAS',
  'SAMX',
  ...r((_, i) => `^.{${i}}X.*\n.{${i}}M.*\n.{${i}}A.*\n.{${i}}S`),
  ...r((_, i) => `^.{${i}}S.*\n.{${i}}A.*\n.{${i}}M.*\n.{${i}}X`),
  ...r((_, i) => `^.{${i}}X.*\n.{${i + 1}}M.*\n.{${i + 2}}A.*\n.{${i + 3}}S`),
  ...r((_, i) => `^.{${i + 3}}X.*\n.{${i + 2}}M.*\n.{${i + 1}}A.*\n.{${i}}S`),
  ...r((_, i) => `^.{${i}}S.*\n.{${i + 1}}A.*\n.{${i + 2}}M.*\n.{${i + 3}}X`),
  ...r((_, i) => `^.{${i + 3}}S.*\n.{${i + 2}}A.*\n.{${i + 1}}M.*\n.{${i}}X`)
].map(s => new RegExp('(?=(' + s + '))', 'gm'))

console.log(
  'Part 1:',
  regs1.map(r => input.match(r)?.length || 0).reduce((s, n) => s + n, 0)
)

const regs2 = [
  ...r((_, i) => `^.{${i}}M.M.*\n.{${i + 1}}A.*\n.{${i}}S.S`),
  ...r((_, i) => `^.{${i}}M.S.*\n.{${i + 1}}A.*\n.{${i}}M.S`),
  ...r((_, i) => `^.{${i}}S.M.*\n.{${i + 1}}A.*\n.{${i}}S.M`),
  ...r((_, i) => `^.{${i}}S.S.*\n.{${i + 1}}A.*\n.{${i}}M.M`)
].map(s => new RegExp('(?=(' + s + '))', 'gm'))

console.log(
  'Part 2:',
  regs2.map(r => input.match(r)?.length || 0).reduce((s, n) => s + n, 0)
)
