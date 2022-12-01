(ns aoc.2019.13.13
  (:require [aoc.2019.intcode :refer [run]]
            [aoc.common :refer [count-where read-input]]))

(let [program (->> (read-input :split-with #",")
                   (map parse-long))]
  (->> program
       run
       :output
       (partition 3)
       (count-where #(= 2 (nth % 2)))
       (println "Part 1:")))