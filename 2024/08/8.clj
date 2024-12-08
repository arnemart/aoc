(ns aoc.2024.08.8
  (:require
   [aoc.common :refer [++ -- parse-input points]]
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

(let [points (parse-input points)
      [h w] (last (last points))
      antennae (->> points
                    (filter #(not= \. (first %)))
                    (group-by first)
                    vals
                    (map #(map last %))
                    (map set))]

  (->> antennae
       (reduce (partial find-antipodes w h 1 1) #{})
       count
       (println "Part 1:"))

  (->> antennae
       (reduce (partial find-antipodes w h 0 ##Inf) #{})
       count
       (println "Part 2:")))