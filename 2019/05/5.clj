(ns aoc.2019.05.5
  (:require [aoc.common :refer [read-input]]
            [aoc.2019.intcode :refer [init-state run]]))

(defn -main []
  (let [program
        (->> (read-input :split-with #",")
             (mapv parse-long))]

    (->> program
         (init-state [1])
         run
         :output
         last
         (println "Part 1:"))

    (->> program
         (init-state [5])
         run
         :output
         last
         (println "Part 2:"))))