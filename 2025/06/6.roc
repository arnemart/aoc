app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

split_line = |ops_str|
  ops_str
    |> Str.trim
    |> Str.split_on " "
    |> List.map Str.trim
    |> List.keep_if |s| s != ""

parse_nums = |nums_str|
  nums_str
    |> split_line
    |> List.map |s| Str.to_u128 s ?? 0

zip : List (List a), a -> List (List a)
zip = |lists, default|
  first = List.first lists ?? []
  List.range { start: At 0, end: Length (List.len first) }
    |> List.map |i|
      List.range { start: At 0, end: Length (List.len lists) }
        |> List.map |j|
          l = List.get lists j ?? []
          List.get l i ?? default

take_while : List a, (a -> Bool) -> List a
take_while = |list, fn|
  when list is
    [] -> []
    [v, .. as rest] -> if fn v then (List.concat [v] (take_while rest fn)) else []

partition_by : List a, (a -> Bool) -> List (List a)
partition_by = |list, fn|
  partition_by_internal = |lst, grps|
    if List.is_empty lst then
      grps
    else
      grp = take_while lst fn
      (partition_by_internal (List.drop_first lst ((List.len grp) + 1)) (List.append grps grp))
  partition_by_internal list []

sum_all : List (List U128), List Str -> U128
sum_all = |nums, ops|
  List.range { start: At 0, end: Length (List.len nums) }
    |> List.map |i| 
      n = List.get nums i ?? []
      op = if (List.get ops i ?? "") == "*" then Num.mul else Num.add
      start = if (List.get ops i ?? "") == "*" then 1 else 0
      List.walk n start op
    |> List.sum

main! = |_args|
  lines = File.read_utf8! "input.txt" ?? ""
    |> Str.split_on "\n"
  
  (nums_strs, ops) = when lines is
    [.. as n, o] -> (n, split_line o)
    [] -> ([], [])

  sum_1 = nums_strs
    |> List.map parse_nums
    |> zip 0
    |> sum_all ops

  sum_2 = nums_strs
    |> List.map |line| line 
      |> Str.to_utf8
      |> List.reverse
    |> zip 0
    |> List.map |n| Str.from_utf8 n ?? "" |> Str.trim
    |> List.map |n| Str.to_u128 n ?? 0
    |> partition_by (|n| n != 0)
    |> sum_all (List.reverse ops)

  Stdout.line! "Part 1: ${sum_1 |> Num.to_str}\nPart 2: ${sum_2 |> Num.to_str}"
