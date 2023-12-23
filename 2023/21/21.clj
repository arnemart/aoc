(ns aoc.2023.21.21
  (:require [aoc.common :refer [read-input]]
            [clojure.math.combinatorics :as combo]))

(def single-step
  (memoize
   (fn [grid h w [y x]]
     (->> [[(dec y) x] [(inc y) x] [y (dec x)] [y (inc x)]]
          (filter (fn [[y x]] (= \. (get-in grid [(mod y h) (mod x w)]))))))))

(defn step [grid h w from]
  (->> from
       (mapcat (partial single-step grid h w))
       set))

(let [grid (->> (read-input)
                (mapv vec))
      h (count grid)
      w (count (first grid))
      start (->> (combo/cartesian-product (range h) (range w))
                 (keep #(when (= \S (get-in grid %)) %))
                 first
                 vec)
      grid (assoc-in grid start \.)
      step (memoize (partial step grid h w))]

  (->> [start]
       (iterate step)
       (take 65)
       last
       count
       (println "Part 1:")))
