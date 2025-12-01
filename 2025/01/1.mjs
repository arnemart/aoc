import { readFileSync } from 'fs'

process.chdir(import.meta.dirname)

const input = readFileSync('input.txt')
  .toString()
  .split('\n')
  .map(s => parseInt(s.replace('L', '-').replace('R', '')))

let v = 50
let nul1 = 0
let nul2 = 0

for (const d of input) {
  const op = d > 0 ? v => v + 1 : v => v - 1
  for (let i = 0; i < Math.abs(d); i++) {
    v = op(v) % 100
    if (v == 0) {
      nul2++
    }
  }
  if (v == 0) {
    nul1++
  }
}

console.log(nul1, nul2)
