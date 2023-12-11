(ns aoc.2023.11.11 
  (:require [aoc.common :refer [manhattan read-input tee zip]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn spread-galaxies [galaxies blank-rows blank-cols amount]
  (->> galaxies
       (map (fn [[y x]]
              [(+ y (->> blank-rows
                         (filter #(< % y))
                         count
                         (* amount)))
               (+ x (->> blank-cols
                         (filter #(< % x))
                         count
                         (* amount)))]))))

(let [picture (->> (read-input)
                   (mapv #(str/split % #"")))
      galaxies (->> (combo/cartesian-product (range (count picture)) (range (count (first picture))))
                    (filter #(= "#" (get-in picture %))))
      [blank-rows blank-cols]
      (->> picture
           (tee [identity #(apply zip %)])
           (map (fn [segment]
                  (keep-indexed (fn [i col] (when (every? #(= "." %) col) i)) segment))))]

  (->> (combo/combinations (spread-galaxies galaxies blank-rows blank-cols 1) 2)
       (map #(apply manhattan %))
       (apply +)
       (println "Part 1:"))

  (->> (combo/combinations (spread-galaxies galaxies blank-rows blank-cols 999999) 2)
       (map #(apply manhattan %))
       (apply +)
       (println "Part 2:")))