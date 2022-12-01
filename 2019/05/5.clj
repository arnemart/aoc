(ns aoc.2019.05.5
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
       (run [5])
       :output
       last
       (println "Part 2:")))

;; Part 1: 16209841
;; Part 2: 8834787