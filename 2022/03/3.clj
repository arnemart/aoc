(ns aoc.2022.03.3
  (:require [aoc.common :refer [read-input sum]]
            [clojure.set :as set]
            [clojure.string :as str]))

(defn priority [s]
  (let [i (int (.charAt s 0))]
    (- i (if (> i 96) 96 38))))

(defn sum-priorities [sets]
  (->> sets
       (map #(apply set/intersection %))
       (map first)
       (map priority)
       sum))

(let [backpacks (->> (read-input)
                     (map #(str/split % #"")))]
  (->> backpacks
       (map #(partition (/ (count %) 2) %))
       (map #(map set %))
       sum-priorities
       (println "Part 1:"))

  (->> backpacks
       (map set)
       (partition 3)
       sum-priorities
       (println "Part 2:")))