(ns aoc.2023.01.1
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def digits1 (into {} (map #(vector (str %) %) (range 1 10))))

(def digits2 (merge digits1 {"one" 1 "two" 2 "three" 3
                             "four" 4 "five" 5 "six" 6
                             "seven" 7 "eight" 8 "nine" 9}))

(defn first-and-last [ds]
  (+ (->> ds keys (apply min) (get ds) (* 10))
     (->> ds keys (apply max) (get ds))))

(defn find-value [digits s]
  (->> digits
       (mapcat (fn [[k v]]
                 [(when-let [fi (str/index-of s k)] [fi v])
                  (when-let [li (str/last-index-of s k)] [li v])]))
       (filter some?)
       (into {})
       first-and-last))

(let [input (read-input)]
  (->> input
       (map (partial find-value digits1))
       (apply +)
       (println "Part 1:"))
  (->> input
       (map (partial find-value digits2))
       (apply +)
       (println "Part 2:")))