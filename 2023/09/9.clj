(ns aoc.2023.09.9 
  (:require [aoc.common :refer [read-input reduce-right split-to-ints zip]]))

(defn diff [ns]
  (->> (zip ns (drop 1 ns))
       (map (fn [[a b]] (- b a)))))

(defn diffs [ns]
  (->> ns
       (iterate diff)
       (take-while #(some identity %))))

(defn predict-next [ns]
  (->> ns
       (map last)
       (apply +)))

(defn predict-prev [ns]
  (->> ns
       (map first)
       (reduce-right -)))

(let [input (->> (read-input)
                 (map split-to-ints)
                 (map diffs))]
  (->> input
       (map predict-next)
       (apply +)
       (println "Part 1:"))

  (->> input
       (map predict-prev)
       (apply +)
       (println "Part 2:")))