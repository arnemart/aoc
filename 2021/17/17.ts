import {
  $,
  combine,
  filter,
  inclusiveRange,
  last,
  length,
  loopUntil,
  map,
  nonNull,
  pipe,
  pluck,
  sortBy,
  within
} from '../../common'

const targetX = [265, 287]
const targetY = [-103, -58]

const inTargetArea = (p: Probe) =>
  $(p.p[0], within(targetX[0], targetX[1])) && $(p.p[1], within(targetY[0], targetY[1]))

const beyondTargetAreaOrMaybeStopped = (p: Probe) =>
  p.p[0] > targetX[1] || p.p[1] < targetY[0] || (p.p[0] < targetX[0] && p.v[0] == 0)

type Probe = { p: [number, number]; v: [number, number]; h: number; hit?: boolean }

const probe = (xv: number, yv: number): Probe => ({ v: [xv, yv], p: [0, 0], h: 0 })

const step = (p: Probe): Probe => ({
  p: [p.p[0] + p.v[0], p.p[1] + p.v[1]],
  v: [Math.max(0, p.v[0] - 1), p.v[1] - 1],
  h: Math.max(p.h, p.p[1] + p.v[1])
})

const fire = (probe: Probe) =>
  loopUntil(
    (_, p) =>
      inTargetArea(p) ? { ...p, hit: true } : beyondTargetAreaOrMaybeStopped(p) ? { ...p, hit: false } : $(p, step),
    pipe(pluck('hit'), nonNull),
    probe
  )

const allTheseHitTheTargetArea = $(
  [inclusiveRange(1, targetX[1]), inclusiveRange(-1000, 1000)],
  combine,
  map(([x, y]) => fire(probe(x, y))),
  filter(pluck('hit')),
  sortBy(pluck('h'))
)

console.log('Part 1:', $(allTheseHitTheTargetArea, last, pluck('h')))

console.log('Part 2:', $(allTheseHitTheTargetArea, length))
