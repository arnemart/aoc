(ns aoc.2024.02.2 
  (:require
   [aoc.common :refer [lines nums parse-input remove-index]]))

(defn safe [report]
  (let [diffs (map - report (drop 1 report))]
    (or (every? #(<= 1 % 3) diffs)
        (every? #(>= -1 % -3) diffs))))

(defn safe-but-one [report]
  (->> (range (count report))
       (map #(remove-index report %))
       (some safe)))

(let [reports (parse-input (lines nums))
      somewhat-safe (filter safe-but-one reports)
      super-safe (filter safe somewhat-safe)]
  
  (println "Part 1:" (count super-safe))
  (println "Part 2:" (count somewhat-safe)))
