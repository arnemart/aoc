(ns aoc.2023.09.9 
  (:require [aoc.common :refer [read-input split-to-ints take-until zip]]))

(defn diffs [ns]
  (->> (zip ns (drop 1 ns))
       (map (fn [[a b]] (- b a)))))

(defn all-diffs [ns]
  (->> ns
       (iterate diffs)
       (take-until #(= 1 (count (set %))))))

(defn predict-next [ns]
  (->> ns
       all-diffs
       (map last)
       (apply +)))

(defn sub [[n & ns]]
  (- n (if (some? ns) (sub ns) 0)))

(defn predict-prev [ns]
  (->> ns
       all-diffs
       (map first)
       sub))

(let [input (->> (read-input)
                 (map split-to-ints))]
  (->> input
       (map predict-next)
       (apply +)
       (println "Part 1:"))
  (->> input
       (map predict-prev)
       (apply +)
       (println "Part 2:")))