(ns aoc.2022.03.3
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]
            [clojure.set :as set]))

(defn priority [s]
  (let [i (int (.charAt s 0))]
    (- i (if (> i 96) 96 38))))

(defn find-priorities [sets]
  (->> sets
       (map #(apply set/intersection %))
       (map first)
       (map priority)
       (apply +)))

(let [backpacks (->> (read-input)
                     (map #(str/split % #"")))]
  (->> backpacks
       (map #(partition (/ (count %) 2) %))
       (map #(map set %))
       find-priorities
       (println "Part 1:")) 

  (->> backpacks
       (map set)
       (partition 3)
       find-priorities
       (println "Part 2:")))
