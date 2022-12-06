(ns aoc.2022.06.6
  (:require [aoc.common :refer [read-input zip]]))

(defn find-marker [signal distinct]
  (->> (range distinct)
       (map #(drop % signal))
       (apply zip)
       (map set)
       (keep-indexed #(when (= (count %2) distinct) %1))
       first
       (+ distinct)))

(let [signal (read-input :split-with #"")]
  (println "Part 1:" (find-marker signal 4))
  (println "Part 2:" (find-marker signal 14)))