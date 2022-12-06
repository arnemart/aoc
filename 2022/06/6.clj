(ns aoc.2022.06.6
  (:require [aoc.common :refer [read-input]]))

(defn find-marker [signal distinct]
  (->> (range (count signal))
       (filter #(-> signal (subvec % (+ % distinct)) set count (= distinct)))
       first
       (+ distinct)))

(let [signal (read-input :split-with #"")]
  (println "Part 1:" (find-marker signal 4))
  (println "Part 2:" (find-marker signal 14)))