app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

read_file! : Str => Str
read_file! = |path|
  File.read_utf8!(path) ?? ""

parse_input : Str -> List Str
parse_input = |input_str|
  Str.split_on(input_str, ",")

to_range : Str -> List U64 [ListWasEmpty, InvalidNumStr]
to_range = |range_str|
  nums = Str.split_on(range_str, "-") |> List.map(|s| Str.to_u64(s) ?? 0)
  start = List.first(nums) ?? 0
  end = List.last(nums) ?? 0
  List.range({ start: At start, end: At end})

valid_1: Num * -> Bool
valid_1 = |num|
  strl = Num.to_str(num) |> Str.to_utf8
  len = List.len(strl)
  if len % 2 == 1 then
    Bool.false
  else
    half = len // 2
    List.sublist(strl, { start: 0, len: half }) ==  List.sublist(strl, { start: half, len: half })

all_equal: List (List a) -> Bool where a implements Bool.Eq
all_equal = |list|
  when list is
    [] -> Bool.true
    [_] -> Bool.true
    [a, b, .. as tail] -> a == b and all_equal(List.concat([b], tail))

valid_2: U64 -> Bool
valid_2 = |num|
  strl = Num.to_str(num) |> Str.to_utf8()
  len = List.len(strl)
  if len == 1 then
    Bool.false
  else
    List.range({ start: At 1, end: At (len // 2)}) 
    |> List.keep_if(|n| len % n == 0)
    |> List.any(|n| all_equal(List.chunks_of(strl, n)))

main! = |_args|
  ranges = read_file!("input.txt") |> parse_input
  codes = List.join_map(ranges, to_range)
  sum1 = List.keep_if(codes, valid_1) |> List.sum
  sum2 = List.keep_if(codes, valid_2) |> List.sum
  Stdout.line!("Part 1: ${Num.to_str(sum1)}, Part 2: ${Num.to_str(sum2)}")
  