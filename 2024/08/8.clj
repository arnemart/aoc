(ns aoc.2024.08.8
  (:require
   [aoc.common :refer [++ -- parse-input]]
   [blancas.kern.core :refer [any-char bind get-position many return]]
   [clojure.math.combinatorics :refer [combinations]]))

(defn xy [pos]
  (++ [(:line pos) (:col pos)] [-1 -2]))

(defn find-antipodes [w h antipodes antennae]
  (->> (combinations antennae 2)
       (reduce (fn [as [p1 p2]]
                 (let [d (-- p1 p2)]
                   (->> [(++ p1 d) (-- p2 d)]
                        (filter (fn [[y x]] (and (<= 0 y h) (<= 0 x w))))
                        (reduce conj as)))) antipodes)))

(defn many-antipodes [w h start delta]
  (->> (iterate (partial ++ delta) start)
       (take-while (fn [[y x]] (and (<= 0 y h) (<= 0 x w))))))

(defn find-more-antipodes [w h antipodes antennae]
  (->> (combinations antennae 2)
       (reduce (fn [as [p1 p2]]
                 (->> (concat
                       (many-antipodes w h p1 (-- p1 p2))
                       (many-antipodes w h p2 (map - (-- p1 p2))))
                      (reduce conj as))) antipodes)))

(let [points (parse-input
              (many (bind [s any-char
                           p get-position]
                          (return [s (xy p)]))))
      antennae (->> points
                    (filter #(and (not= \newline (first %)) (not= \. (first %))))
                    (reduce (fn [m [a b]] (assoc m a (conj (get m a #{}) b))) {})
                    vals)
      w (->> points (map last) (map last) (apply max))
      h (->> points (map last) (map first) (apply max))]

  (->> antennae
       (reduce (partial find-antipodes w h) #{})
       count
       (println "Part 1:"))

  (->> antennae
       (reduce (partial find-more-antipodes w h) #{})
       count
       (println "Part 2:")))