(ns aoc.2023.06.6 
  (:require [aoc.common :refer [read-input split-to-ints zip]]
            [clojure.string :as str]))

(defn find-time [[t d]]
  (->> (range)
       (map #(* % (- t %)))
       (drop-while #(<= % d))
       (take-while #(< d %))
       count))

(let [input (read-input)
      races1 (->> input
                  (map split-to-ints)
                  (apply zip))
      race2 (->> input
                 (map #(str/replace % #"\D" ""))
                 (map parse-long))]

  (->> races1
       (map find-time)
       (apply *)
       (println "Part 1:"))
  
  (println "Part 2:" (find-time race2)))