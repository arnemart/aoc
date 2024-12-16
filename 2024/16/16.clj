(ns aoc.2024.16.16 
  (:require
   [aoc.astar :refer [astar]]
   [aoc.common :refer [lines manhattan parse-input spy]]
   [blancas.kern.core :refer [many one-of*]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(def t "#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################")

(defn find-neighbors [maze [y x]]
  (->> [[(inc y) x \v] [(dec y) x \^] [y (inc x) \>] [y (dec x) \<]]
       (filter (fn [[y x]] (contains? #{\. \E} (get-in maze [y x]))))))

(let [maze (parse-input (lines (many (one-of* "#.SE"))) :test t)
      [start end] (->> (cartesian-product (range (count maze)) (range (count (first maze))))
                       (reduce (fn [[s e] p]
                                 (if (and s e) (reduced [s e])
                                     (let [v (get-in maze p)]
                                       (cond (= \S v) [p e]
                                             (= \E v) [s p]
                                             :else [s e]))))
                               [nil nil]))
      best-path (astar :start (concat start [\>])
                       :is-end #(= end (drop-last %))
                       :get-neighbors (partial find-neighbors maze)
                       :calculate-cost (fn [[_ _ d1] [_ _ d2]]
                                         (if (= d1 d2) 1 1001))
                       :heuristic (fn [[x y]] (manhattan [y x] end)))]

  (println "Part 1:" (:cost best-path))
  (count (:path best-path)))
