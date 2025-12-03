app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

line_to_digits: Str -> List U8
line_to_digits = |line|
  Str.to_utf8(line) |> List.map(|d| d - 48)

max_indexed: List U8, U64, (U64, U8) -> (U64, U8)
max_indexed = |list, i, (max_i, max_n)|
  when list is
    [] -> (max_i, max_n)
    [n, .. as rest] -> max_indexed(rest, i + 1, (if n > max_n then (i, n) else (max_i, max_n)))

joltage: U64, List U8 -> Str
joltage = |more, batteries|
  if more == 0 then
    ""
  else
    (first_i, first_n) = batteries
      |> List.drop_last(more - 1)
      |> max_indexed(0, (0, 0))
    Num.to_str(first_n) |> Str.concat(joltage(more - 1, List.drop_first(batteries, first_i + 1)))

get_joltage: U64, List(List U8) -> Str
get_joltage = |count, batteries|
  batteries
    |> List.map(|b| joltage(count, b))
    |> List.map(|b| Str.to_u64(b) ?? 0)
    |> List.sum
    |> Num.to_str

main! = |_args|
  batteries = File.read_utf8!("input.txt") ?? ""
    |> Str.split_on("\n")
    |> List.map(line_to_digits)

  joltage_1 = get_joltage(2, batteries)
  joltage_2 = get_joltage(12, batteries)
  
  Stdout.line!("Part 1: ${joltage_1}, Part 2: ${joltage_2}")
