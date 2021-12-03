import { $, entries, filter, forEach, keys, lines, map, match, readInput, some, split, sum, values } from '../../common'

class Bag {
  color: string
  private bagsInsideThisBag: Map<Bag, number>

  private static bags = new Map<string, Bag>()

  static allBags(): Bag[] {
    return $(this.bags, values)
  }

  static getBag(color: string): Bag {
    const bag = Bag.bags.get(color) || new Bag(color)
    Bag.bags.set(color, bag)
    return bag
  }

  private constructor(color: string) {
    this.color = color
    this.bagsInsideThisBag = new Map<Bag, number>()
  }

  add(bag: Bag, count: number) {
    this.bagsInsideThisBag.set(bag, count)
  }

  canContain(bag: Bag): boolean {
    return (
      this.bagsInsideThisBag.has(bag) ||
      $(
        keys(this.bagsInsideThisBag),
        some(b => b.canContain(bag))
      )
    )
  }

  countBags(): number {
    return $(
      entries(this.bagsInsideThisBag),
      map(([bag, count]) => count + bag.countBags() * count),
      sum
    )
  }
}

const bagreg = /^((\d) )?([\w\s]+) bags?\.?$/

$(
  readInput(),
  lines,
  forEach(line => {
    const parts = line.split(' contain ')
    const bagColor = parts[0].match(bagreg)[3]
    const thisBag = Bag.getBag(bagColor)
    $(
      parts[1],
      split(', '),
      map(match(bagreg)),
      forEach(matches => {
        if (matches && matches[3] != 'no other') {
          const bag = Bag.getBag(matches[3])
          thisBag.add(bag, parseInt(matches[1]))
        }
      })
    )
  })
)

const myBag = Bag.getBag('shiny gold')

console.log(
  'Part 1:',
  $(
    Bag.allBags(),
    filter(bag => bag.canContain(myBag))
  ).length
)

console.log('Part 2:', myBag.countBags())
