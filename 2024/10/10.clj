(ns aoc.2024.10.10
  (:require
   [aoc.common :refer [digit-num lines parse-input]]
   [blancas.kern.core :refer [many]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn around [grid what [y x]]
  (->> [[(inc y) x] [(dec y) x] [y (inc x)] [y (dec x)]]
       (filter #(= what (get-in grid %)))))

(defn find-trails [cat-fn start]
  (loop [what 0 current #{start}]
    (cond (= 0 (count current)) 0
          (= 9 what) (count current)
          :else (recur (inc what)
                       (->> current
                            (mapcat (partial cat-fn (inc what)))
                            set)))))

(let [grid (parse-input (lines (many digit-num)))
      h (count grid)
      w (count (first grid))
      zeroes (->> (cartesian-product (range h) (range w))
                  (filter #(= 0 (get-in grid %))))]

  (->> zeroes
       (map (partial find-trails (partial around grid)))
       (apply +)
       (println "Part 1:"))

  (->> zeroes
       (map vector)
       (map (partial find-trails #(map (partial conj %2) (around grid %1 (last %2)))))
       (apply +)
       (println "Part 2:")))