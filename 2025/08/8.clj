(ns aoc.2025.08.8
  (:require
   [aoc.common :refer [comma-or-space-sep lines parse-input]]
   [blancas.kern.core :refer [dec-num]]
   [clojure.math :as math]
   [clojure.math.combinatorics :as combo]
   [clojure.set :as set]))

(defn distance [[[x1 y1 z1] [x2 y2 z2]]]
  [(math/sqrt (+ (math/pow (- x1 x2) 2)
                 (math/pow (- y1 y2) 2)
                 (math/pow (- z1 z2) 2)))
   [[x1 y1 z1] [x2 y2 z2]]])

(defn combine [circuits [_ [b1 b2]]]
  (let [found-1 (some #(when (contains? % b1) %) circuits)
        found-2 (some #(when (contains? % b2) %) circuits)]
    (if (and (empty? found-1) (empty? found-2))
      (conj circuits #{b1 b2})
      (-> circuits
          (disj found-1)
          (disj found-2)
          (conj (conj (set/union found-1 found-2) b1 b2))))))

(let [boxes (parse-input (lines (comma-or-space-sep dec-num)))
      distances (->> (combo/combinations boxes 2)
                     (map distance)
                     (sort-by first)
                     vec)
      after-1000 (->> distances
                      (take 1000)
                      (reduce combine #{}))]

  (->> after-1000
       (map count)
       sort
       reverse
       (take 3)
       (apply *)
       (println "Part 1:"))

  (->> (drop 1000 distances)
       (reduce (fn [circuits p]
                 (let [next-circuits (combine circuits p)]
                   (if (and (= 1 (count next-circuits))
                            (= (count (first next-circuits)) (count boxes)))
                     (reduced (->> p (drop 1) first (map first) (apply *)))
                     next-circuits)))
               after-1000)
       (println "Part 2:")))
