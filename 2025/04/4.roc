app [main!] { pf: platform "https://github.com/roc-lang/basic-cli/releases/download/0.20.0/X73hGh05nNTkDHU06FHC0YfFaQB1pimX7gncRcao5mU.tar.br" }

import pf.Stdout
import pf.File

Point : (I64, I64)
Grid : Set Point

line_to_points = |line, line_no|
  Str.to_utf8(line)
    |> List.map_with_index(|c, c_no| (c, (Num.to_i64(line_no), Num.to_i64(c_no))))
    |> List.keep_if(|(c, _)| c == 64)

count_neighbors = |grid, (y, x)|
  [(y-1, x-1), (y, x-1), (y+1, x-1),
   (y-1, x),             (y+1, x),
   (y-1, x+1), (y, x+1), (y+1, x+1)]
  |> List.count_if(|p| Set.contains(grid, p))

remove_neighbors = |grid|
  next_grid = Set.keep_if(grid, |p| count_neighbors(grid, p) >= 4)
  if grid == next_grid then
    grid
  else
    remove_neighbors(next_grid)

main! = |_args|
  grid : Grid
  grid = File.read_utf8!("input.txt") ?? ""
    |> Str.split_on("\n")
    |> List.map_with_index(line_to_points)
    |> List.join_map(|line| List.map(line, |(_, p)| p))
    |> Set.from_list

  removable = grid
    |> Set.keep_if(|p| count_neighbors(grid, p) < 4)
    |> Set.len
    |> Num.to_str
  
  final_grid = remove_neighbors(grid)
  removed = Set.len(grid) - Set.len(final_grid) |> Num.to_str

  Stdout.line!("Part 1: ${removable}, part 2: ${removed}")
