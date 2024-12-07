(ns aoc.2023.09.9 
  (:require
   [aoc.common :refer [flip read-input reduce-right split-to-ints]]))

(defn diff [ns]
  (->> (partition 2 1 ns)
       (map #(apply - (reverse %)))))

(defn diffs [ns]
  (->> (iterate diff ns)
       (take-while #(some identity %))))

(defn predict-next [ns]
  (->> (map last ns)
       (apply +)))

(defn predict-prev [ns]
  (->> (map first ns)
       (reduce-right (flip -))))

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