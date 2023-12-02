(ns aoc.2023.01.1
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def digits ["zero" "one" "two" "three" "four" "five" "six" "seven" "eight" "nine"])

(defn calibrate [lines]
  (->> lines
       (map #(re-seq #"\d" %))
       (map #(parse-long (str (first %) (last %))))
       (apply +)))

(let [input (read-input)]
  (->> input
       calibrate
       (println "Part 1:"))
  (->> input
       (map (fn [s]
              (reduce-kv #(str/replace %1 %3 (str %3 %2 %3)) s digits)))
       calibrate
       (println "Part 2:")))
