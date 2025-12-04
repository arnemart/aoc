app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

to_range = |range_str|
  nums = range_str |> Str.split_on("-") |> List.map(|s| Str.to_u64(s) ?? 0)
  when nums is
    [first, last] -> List.range({ start: At first, end: At last })
    _ -> []

valid_1 = |num|
  strl = Num.to_str(num) |> Str.to_utf8
  len = List.len(strl)
  if len % 2 == 1 then
    Bool.false
  else
    half = len // 2
    List.sublist(strl, { start: 0, len: half }) ==  List.sublist(strl, { start: half, len: half })

all_equal = |list|
  when list is
    [] -> Bool.true
    [_] -> Bool.true
    [a, b, .. as tail] -> a == b and all_equal(List.prepend(tail, b))

valid_2 = |num|
  strl = Num.to_str(num) |> Str.to_utf8()
  len = List.len(strl)
  when len is
    1 -> Bool.false
    _ -> List.range({ start: At 1, end: At (len // 2) }) 
      |> List.keep_if(|n| len % n == 0)
      |> List.any(|n| all_equal(List.chunks_of(strl, n)))

main! = |_args|
  codes = File.read_utf8!("input.txt") ?? ""
    |> Str.split_on(",")
    |> List.join_map(to_range)
  sum1 = codes |> List.keep_if(valid_1) |> List.sum |> Num.to_str
  sum2 = codes |> List.keep_if(valid_2) |> List.sum |> Num.to_str
  Stdout.line!("Part 1: ${sum1}, Part 2: ${sum2}")
  