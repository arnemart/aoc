(ns aoc.2023.03.3 
  (:require [aoc.common :refer [inclusive-range re-seq-indexed read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.set :as set]
            [clojure.string :as str]))

(defn neighbors [{:keys [start end y]}]
  (let [inside (->> (range start end)
                    (map #(list y %)))
        all-neighbors (combo/cartesian-product
                       (inclusive-range (dec y) (inc y))
                       (inclusive-range (dec start) end))]
    (set/difference (set all-neighbors) (set inside))))

(defn alone [grid num]
  (every? #(= "." (get-in grid % "."))
          (neighbors num)))

(defn find-gears [grid num]
  (when-let [gear (->> (neighbors num)
                       (filter #(= "*" (get-in grid %)))
                       first)]
    (assoc num :gear gear)))

(let [input (read-input)
      grid (->> input (mapv #(str/split % #"")) vec)
      nums (->> input
                (map-indexed (fn [i line]
                               (->> line
                                    (re-seq-indexed #"\d+")
                                    (map #(update % :match parse-long))
                                    (map #(assoc % :y i)))))
                (apply concat))]

  (->> nums
       (filter #(not (alone grid %)))
       (map :match)
       (apply +)
       (println "Part 1:"))

  (->> nums
       (map #(find-gears grid %))
       (filter #(some? (:gear %)))
       (group-by :gear)
       (map last)
       (filter #(= 2 (count %)))
       (map #(apply * (map :match %)))
       (apply +)
       (println "Part 2:")))