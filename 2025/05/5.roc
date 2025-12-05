app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

parse_ranges = |ranges_str|
  ranges_str
    |> Str.split_on "\n"
    |> List.map |range_str|
      nums = Str.split_on range_str "-" 
        |> List.map |s| Str.to_u64 s ?? 0
      when nums is
        [a, b] -> (a, b)
        _ -> (0, 0)
    |> List.sort_with |(a, _), (b, _)| Num.compare a b

parse_ingredients = |ingredients_str|
  ingredients_str 
    |> Str.split_on "\n" 
    |> List.map |s| Str.to_u64 s ?? 0

in_ranges = |ranges, ingredient|
  ranges
    |> List.any |(start, end)| 
      start <= ingredient and ingredient <= end

shrink_ranges = |start_ranges|
  when start_ranges is
    [first, .. as rest] -> rest
      |> List.walk [first] |ranges, (start, end)|
        (_, prev_end) = List.last ranges ?? (0, 0)
        if end <= prev_end then
          ranges
        else if start > prev_end then
          ranges |> List.append (start, end)
        else
          (ranges |> List.append (prev_end + 1, end))
    _ -> []

main! = |_args|
  parts = File.read_utf8! "input.txt" ?? ""
    |> Str.split_on "\n\n"
  (ranges, ingredients) = when parts is
    [ranges_str, ingredients_str] -> (parse_ranges ranges_str, parse_ingredients ingredients_str)
    _ -> ([], [])

  safe_ingredients = ingredients
    |> List.count_if |ingredient| in_ranges ranges ingredient
  
  total_safe_ingredients = ranges
    |> shrink_ranges
    |> List.map |(start, end)| end - start + 1
    |> List.sum

  Stdout.line! "Part 1: ${safe_ingredients |> Num.to_str}\nPart 2: ${total_safe_ingredients |> Num.to_str}"