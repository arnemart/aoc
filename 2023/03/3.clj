(ns aoc.2023.03.3 
  (:require [aoc.common :refer [inclusive-range re-seq-indexed read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.set :as set]
            [clojure.string :as str]))

(defn neighbors [[v x y]]
  (let [vpos (->> (range x (+ (count v) x))
                  (map #(vector y %))
                  set)
        neighbors (->> (combo/cartesian-product
                        (inclusive-range (dec y) (inc y))
                        (inclusive-range (dec x) (+ x (count v))))
                       set)]
    (set/difference neighbors vpos)))

(defn not-alone [grid num]
  (not (every? #(= "." (get-in grid % "."))
               (neighbors num))))

(defn find-gears [grid num]
  (let [gears (->> (neighbors num)
                   (filter #(= "*" (get-in grid % "."))))]
    (when (seq? gears)
      {:num num :gear (first gears)})))

(let [input (read-input)
      grid (->> input (map #(str/split % #"")) vec)
      nums (->> input
                (map-indexed (fn [i line]
                               (->> line
                                    (re-seq-indexed #"\d+")
                                    (map #(conj % i)))))
                (apply concat))]

  (->> nums
       (filter #(not-alone grid %))
       (map first)
       (map parse-long)
       (apply +)
       (println "Part 1:"))

  (->> nums
       (map #(find-gears grid %))
       (filter #(some? (:gear %)))
       (group-by :gear)
       (filter #(= 2 (count (last %))))
       (map #(->> %
                  last
                  (map (comp parse-long first :num))
                  (apply *)))
       (apply +)
       (println "Part 2:")))