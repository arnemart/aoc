import {
  $,
  cond,
  fillArray,
  flatten,
  int,
  join,
  map,
  parse,
  pipe,
  range,
  readInput,
  reduce,
  set,
  setIn,
  shift,
  spy,
  sum,
  zip
} from '../../common'

type Cmd = {
  type: 'rect' | 'rotatecolumn' | 'rotaterow'
  v1: number
  v2: number
}
type Display = number[][]

const reg = /(rect|rotate) (((\d+)x(\d+))|(column|row) (x|y)=(\d+) by (\d+))/
const input = $(
  readInput(),
  parse(reg, m => ({
    type: m[1] == 'rect' ? m[1] : m[1] + m[7],
    v1: m[1] == 'rect' ? int(m[4]) : int(m[8]),
    v2: m[1] == 'rect' ? int(m[5]) : int(m[9])
  }))
) as Cmd[]

const drawCommands = {
  rect:
    (x: number, y: number) =>
    (disp: Display): Display =>
      $(
        range(y),
        map(y =>
          $(
            range(x),
            map(x => [x, y])
          )
        ),
        flatten(),
        reduce((disp, [x, y]) => $(disp, setIn([y, x], 1)), disp)
      ),
  rotatey:
    (y: number, amt: number) =>
    (disp: Display): Display =>
      $(disp, set(y, shift(amt))),
  rotatex:
    (x: number, amt: number) =>
    (disp: Display): Display =>
      $(disp, zip, drawCommands.rotatey(x, amt), zip) as Display
}

const display = $(
  input,
  reduce((disp, cmd) => $(disp, drawCommands[cmd.type](cmd.v1, cmd.v2)), fillArray([50, 6], 0))
)

console.log('Part 1:', $(display, flatten(), sum))

const print = (d: Display) => $(d, map(pipe(map(cond([[1, '0']], ' ')), join())), join('\n'), spy)

console.log('Part 2:')
$(display, print)
