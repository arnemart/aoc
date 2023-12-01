(ns aoc.2023.01.1
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def digits1 (into {} (map #(vector (str %) %) (range 1 10))))

(def digits2 (merge digits1 {"one" 1 "two" 2 "three" 3
                             "four" 4 "five" 5 "six" 6
                             "seven" 7 "eight" 8 "nine" 9}))

(defn find-digits [s digits]
  (->> digits
       (mapcat (fn [[k v]]
                 [(when-let [fi (str/index-of s k)] [fi v])
                  (when-let [li (str/last-index-of s k)] [li v])]))
       (filter some?)
       (into {})))

(defn first-and-last [ds]
  (let [first-key (apply min (keys ds))
        last-key (apply max (keys ds))]
    (+ (* (get ds first-key) 10)
       (get ds last-key))))

(let [input (read-input)]
  (->> input 
       (map #(find-digits % digits1)) 
       (map first-and-last) 
       (apply +) 
       (println "Part 1:"))
  (->> input 
       (map #(find-digits % digits2)) 
       (map first-and-last) 
       (apply +) 
       (println "Part 2:")))