(ns aoc.2023.09.9 
  (:require [aoc.common :refer [read-input split-to-ints zip]]))

(defn diff [ns]
  (->> (zip ns (drop 1 ns))
       (map (fn [[a b]] (- b a)))))

(defn diffs [ns]
  (->> ns
       (iterate diff)
       (take-while #(some identity %))))

(defn predict-next [ns]
  (->> (diffs ns)
       (map last)
       (apply +)))

(defn sub [[n & ns]]
  (- n (if (some? ns) (sub ns) 0)))

(defn predict-prev [ns]
  (->> (diffs ns)
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