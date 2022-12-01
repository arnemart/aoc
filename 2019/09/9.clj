(ns aoc.2019.09.9
  (:require [aoc.common :refer [read-input]]
            [aoc.2019.intcode :refer [run]]))

(let [program
      (->> (read-input :split-with #",")
           (mapv parse-long))]

  (->> program
       (run [1])
       :output
       last
       (println "Part 1:"))

  (->> program
       (run [2])
       :output
       last
       (println "Part 2:")))

;; Part 1: 3533056970
;; Part 2: 72852