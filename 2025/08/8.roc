app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

Point : (I64, I64, I64)

parse_line = |s|
  nums = Str.split_on s ","
    |> List.map |n| Str.to_i64 n ?? 0
  when nums is
    [x, y, z] -> (x, y, z)
    _ -> (0, 0, 0)

combinations : List a -> List (a, a)
combinations = |list|
  when list is
  [first, .. as rest] -> List.concat (List.map rest |v| (first, v)) (combinations rest)
  _ -> []

distance : Point, Point -> F64
distance = |(x1, y1, z1), (x2, y2, z2)|
  Num.sqrt ((Num.pow (Num.to_frac (x1 - x2)) 2)
           + (Num.pow (Num.to_frac (y1 - y2)) 2)
           + (Num.pow (Num.to_frac (z1 - z2)) 2))

drop_many : List a, List U64 -> List a
drop_many = |list, ids|
  Set.from_list ids
    |> Set.to_list
    |> List.sort_desc
    |> List.walk list |l, i| List.drop_at l i

combine : List (Set Point), (F64, (Point, Point)) -> List (Set Point)
combine = |circuits, (_, (b1, b2))|
  found_1_i = List.find_first_index circuits (|s| Set.contains s b1)
  found_2_i = List.find_first_index circuits (|s| Set.contains s b2)
  found_1 = Result.map_ok found_1_i |i| List.get circuits i
  found_2 = Result.map_ok found_2_i |i| List.get circuits i
  when (found_1_i, found_1, found_2_i, found_2) is
    (Err NotFound, Err NotFound, Err NotFound, Err NotFound) -> 
      List.append circuits (Set.from_list [b1, b2])
    (Ok i1, Ok (Ok s1), Err NotFound, Err NotFound) ->
      circuits |> List.drop_at i1 |> List.append (s1 |> Set.insert b2)
    (Err NotFound, Err NotFound, Ok i2, Ok (Ok s2)) ->
      circuits |> List.drop_at i2 |> List.append (s2 |> Set.insert b1)
    (Ok i1, Ok (Ok s1), Ok i2, Ok (Ok s2)) ->
      circuits |> drop_many [i1, i2] |> List.append (s1 |> Set.union s2 |> Set.insert b1 |> Set.insert b2)
    _ -> []

main! = |_args|
  points = File.read_utf8! "input.txt" ?? ""
    |> Str.split_on "\n"
    |> List.map parse_line
  
  distances = combinations points
    |> List.map |(a, b)| (distance a b, (a, b))
    |> List.sort_with |(a, _), (b, _)| Num.compare a b
  
  after_1000 = distances |> List.take_first 1000 |> List.walk [] combine

  res_1 = after_1000
    |> List.map Set.len
    |> List.sort_desc
    |> List.take_first 3
    |> List.walk 1 Num.mul
  
  res_2 = distances
    |> List.drop_first 1000
    |> List.walk_until (0, after_1000) |(_, circuits), (d, ((x1, y1, z1), (x2, y2, z2)))|
      next_circuits = combine circuits (d, ((x1, y1, z1), (x2, y2, z2)))
      if (List.len next_circuits) == 1 and (Set.len (List.first next_circuits ?? Set.empty({}))) == List.len points then
        Break (x1 * x2, next_circuits)
      else
        Continue (0, next_circuits)
  

  Stdout.line! "Part 1: ${res_1 |> Num.to_str}\nPart 2: ${res_2.0 |> Num.to_str}"
