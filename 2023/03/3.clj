(ns aoc.2023.03.3 
  (:require [aoc.common :refer [inclusive-range re-seq-indexed read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.set :as set]
            [clojure.string :as str]))

(defn neighbors [[v x y]]
  (let [vpos (->> (range x (+ (count v) x))
                  (map #(list y %))
                  set)
        neighbors (->> (combo/cartesian-product
                        (inclusive-range (dec y) (inc y))
                        (inclusive-range (dec x) (+ x (count v))))
                       set)]
    (set/difference neighbors vpos)))

(defn alone [grid num]
  (every? #(= "." (get-in grid % "."))
          (neighbors num)))

(defn find-gears [grid num]
  (let [gear (->> (neighbors num)
                  (filter #(= "*" (get-in grid % ".")))
                  first)]
    (when (some? gear)
      {:num num :gear gear})))

(let [input (read-input)
      grid (->> input (map #(str/split % #"")) vec)
      nums (->> input
                (map-indexed (fn [i line]
                               (->> line
                                    (re-seq-indexed #"\d+")
                                    (map #(conj % i)))))
                (apply concat))]

  (->> nums
       (filter #(not (alone grid %)))
       (map first)
       (map parse-long)
       (apply +)
       (println "Part 1:"))

  (->> nums
       (map #(find-gears grid %))
       (filter #(some? (:gear %)))
       (group-by :gear)
       (map last)
       (filter #(= 2 (count %)))
       (map #(->> %
                  (map (comp parse-long first :num))
                  (apply *)))
       (apply +)
       (println "Part 2:")))