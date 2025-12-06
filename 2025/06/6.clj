(ns aoc.2025.06.6
  (:require
   [aoc.common :refer [read-input tee zip]]
   [clojure.string :as str]))

(defn eval-sum [strs]
  (->> strs
       (map #(str/join " " %1))
       (map #(str "(" (first %1) " " (subs %1 1) ")"))
       (map (comp eval read-string))
       (apply +)))

(let [input-lines (->> (read-input)
                       (tee [drop-last last])
                       (apply conj))]

  (->> input-lines
       (map #(str/split %1 #"\s+"))
       (apply zip)
       eval-sum
       (println "Part 1:"))

  (->> input-lines
       (map (comp reverse seq))
       (apply zip)
       (map (comp str/trim str/join))
       (partition-by empty?)
       (keep-indexed #(when (even? %1) %2))
       (map reverse)
       eval-sum
       (println "Part 2:")))

