(ns aoc.2024.08.8
  (:require
   [aoc.common :refer [++ -- parse-input]]
   [blancas.kern.core :refer [any-char bind get-position many return]]
   [clojure.math.combinatorics :refer [combinations]]))

(defn many-antipodes [w h start delta]
  (->> (iterate (partial ++ delta) start)
       (take-while (fn [[y x]] (and (<= 0 y h) (<= 0 x w))))))

(defn find-antipodes [w h drp keep antipodes antennae]
  (->> (combinations antennae 2)
       (reduce (fn [as [p1 p2]]
                 (->> [(many-antipodes w h p1 (-- p1 p2))
                       (many-antipodes w h p2 (map - (-- p1 p2)))]
                      (map #(->> % (drop drp) (take keep)))
                      (apply concat)
                      (reduce conj as))) antipodes)))

(let [points (parse-input
              (many (bind [s any-char
                           p get-position]
                          (return [s (++ [(:line p) (:col p)] [-1 -2])]))))
      antennae (->> points
                    (filter #(and (not= \newline (first %)) (not= \. (first %))))
                    (reduce (fn [m [a b]] (assoc m a (conj (get m a #{}) b))) {})
                    vals)
      w (->> points (map last) (map last) (apply max))
      h (->> points (map last) (map first) (apply max))]

  (->> antennae
       (reduce (partial find-antipodes w h 1 1) #{})
       count
       (println "Part 1:"))

  (->> antennae
       (reduce (partial find-antipodes w h 0 ##Inf) #{})
       count
       (println "Part 2:")))