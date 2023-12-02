(ns aoc.2023.01.1
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def digits ["zero" "one" "two" "three" "four" "five" "six" "seven" "eight" "nine"])

(defn get-digits [s]
  (let [m (re-seq #"\d" s)]
    (+ (* 10 (parse-long (first m)))
       (parse-long (last m)))))

(let [input (read-input)]
  (->> input
       (map get-digits)
       (apply +)
       (println "Part 1:"))
  (->> input
       (map (fn [s]
              (reduce-kv #(str/replace %1 %3 (str %3 %2 %3)) s digits)))
       (map get-digits)
       (apply +)
       (println "Part 2:")))
