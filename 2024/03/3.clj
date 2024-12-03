(ns aoc.2024.03.3
  (:require
   [aoc.common :refer [read-input-str]]
   [clojure.string :as str]))

(defn mul-all [s]
  (->> s
       (re-seq #"mul\((\d+),(\d+)\)")
       (map (fn [[_ a b]] (* (parse-long a) (parse-long b))))
       (apply +)))

(let [input (read-input-str)]
  (println "Part 1:" (mul-all input))
  (println "Part 2:" (-> input
                         (str/replace #"(?s)don't\(\).*?do\(\)" "")
                         mul-all)))

