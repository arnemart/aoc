import { booleans, geometries, measurements, primitives } from '@jscad/modeling'
import { $, ints, parse, readInput, reduce, round } from '../../common'

const cubes = $(
  readInput(),
  parse(/^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)$/, ([_, o, ...cs]) => ({
    v: o == 'on',
    cs: $(cs, ints)
  }))
)

const geom = $(
  cubes,
  reduce((g, { v, cs }) => {
    const cub = primitives.cuboid({
      center: [(cs[0] + cs[1]) / 2, (cs[2] + cs[3]) / 2, (cs[4] + cs[5]) / 2],
      size: [cs[1] + 1 - cs[0], cs[3] + 1 - cs[2], cs[5] + 1 - cs[4]]
    })
    return v ? booleans.union(g, cub) : booleans.subtract(g, cub)
  }, geometries.geom3.create())
)

const centralArea = primitives.cuboid({
  center: [0, 0, 0],
  size: [100, 100, 100]
})

console.log('Part 1:', round(measurements.measureVolume(booleans.intersect(geom, centralArea))))

console.log('Part 2 is in the vicinity of:', round(measurements.measureAggregateVolume(geom)))
