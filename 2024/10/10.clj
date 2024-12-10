(ns aoc.2024.10.10
  (:require
   [aoc.common :refer [digit-num lines parse-input]]
   [blancas.kern.core :refer [many]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn around [grid what [y x]]
  (->> [[(inc y) x] [(dec y) x] [y (inc x)] [y (dec x)]]
       (filter #(= what (get-in grid %)))))

(defn find-trails [grid start]
  (loop [next 1 trails #{[start]}]
    (cond (= 0 (count trails)) #{}
          (> next 9) trails
          :else (recur (inc next)
                       (->> trails
                            (mapcat #(map (partial conj %) (around grid next (last %))))
                            set)))))

(let [grid (parse-input (lines (many digit-num)))
      trails (->> (cartesian-product (range (count grid)) (range (count (first grid))))
                  (filter #(= 0 (get-in grid %)))
                  (map (partial find-trails grid)))]

  (->> trails
       (map #(->> (map last %) set count))
       (apply +)
       (println "Part 1:"))

  (->> trails
       (map count)
       (apply +)
       (println "Part 2:")))