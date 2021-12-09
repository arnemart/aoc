import { $, int, length, match, readInput, substr } from '../../common'

const input = readInput()

const decompress = (input: string, recursive = false, output = 0): number => {
  const marker = $(input, match(/\((\d+)x(\d+)\)/))
  if (marker) {
    const start = marker[0].length + marker.index
    const end = start + int(marker[1])
    const bloat = $(input, substr(start, end))
    return decompress(
      $(input, substr(end)),
      recursive,
      output + marker.index + (recursive ? decompress(bloat, true) : $(bloat, length)) * int(marker[2])
    )
  } else {
    return output + input.length
  }
}

console.log('Part 1:', decompress(input))

console.log('Part 2:', decompress(input, true))
