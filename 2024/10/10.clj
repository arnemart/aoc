(ns aoc.2024.10.10
  (:require
   [aoc.common :refer [digit-num lines parse-input]]
   [blancas.kern.core :refer [many]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn around [grid what [y x]]
  (->> [[(inc y) x] [(dec y) x] [y (inc x)] [y (dec x)]]
       (filter #(= what (get-in grid %)))))

(defn find-trails [cat-fn start]
  (loop [next 1 trails #{start}]
    (cond (= 0 (count trails)) 0
          (> next 9) (count trails)
          :else (recur (inc next)
                       (->> trails
                            (mapcat (partial cat-fn next))
                            set)))))

(let [grid (parse-input (lines (many digit-num))) 
      heads (->> (cartesian-product (range (count grid)) (range (count (first grid))))
                 (filter #(= 0 (get-in grid %))))]

  (->> heads
       (map (partial find-trails (partial around grid)))
       (apply +)
       (println "Part 1:"))

  (->> heads
       (map vector)
       (map (partial find-trails #(map (partial conj %2) (around grid %1 (last %2)))))
       (apply +)
       (println "Part 2:")))