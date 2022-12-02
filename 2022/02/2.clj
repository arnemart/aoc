(ns aoc.2022.02.2
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def scores-part1 {"A" {"X" 4 "Y" 8 "Z" 3}
                   "B" {"X" 1 "Y" 5 "Z" 9}
                   "C" {"X" 7 "Y" 2 "Z" 6}})

(def scores-part2 {"A" {"X" 3 "Y" 4 "Z" 8}
                   "B" {"X" 1 "Y" 5 "Z" 9}
                   "C" {"X" 2 "Y" 6 "Z" 7}})

(let [strategy (map #(str/split % #" ") (read-input))]
  (->> strategy
       (map #(get-in scores-part1 %))
       (apply +)
       (println "Part 1:"))

  (->> strategy
       (map #(get-in scores-part2 %))
       (apply +)
       (println "Part 1:")))