(ns aoc.2023.01.1
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def digits1 (into {} (map #(vector (str %) %) (range 1 10))))

(def digits2 (merge digits1 {"one" 1 "two" 2 "three" 3
                             "four" 4 "five" 5 "six" 6
                             "seven" 7 "eight" 8 "nine" 9}))

(def re1 (re-pattern (str "(?=(" (str/join "|" (keys digits1)) "))")))
(def re2 (re-pattern (str "(?=(" (str/join "|" (concat (keys digits1) (keys digits2))) "))")))

(defn get-digits [re digits s]
  (let [m (re-seq re s)]
    (+ (* 10 (get digits (last (first m))))
       (get digits (last (last m))))))

(let [input (read-input)]
  (->> input
       (map (partial get-digits re1 digits1))
       (apply +)
       (println "Part 1:"))
  (->> input
       (map (partial get-digits re2 digits2))
       (apply +)
       (println "Part 2:")))
