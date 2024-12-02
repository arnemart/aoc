(ns aoc.2024.02.2 
  (:require
   [aoc.common :refer [parse-input remove-index]]
   [blancas.kern.core :refer [dec-num new-line* sep-by space]]))

(defn safe [report]
  (let [diffs (map - report (drop 1 report))]
    (or (every? #(<= 1 % 3) diffs)
        (every? #(>= -1 % -3) diffs))))

(defn safe-but-one [report]
  (->> (range (count report))
       (map #(remove-index report %))
       (some safe)))

(let [reports (parse-input (sep-by new-line* (sep-by space dec-num)))
      somewhat-safe (filter safe-but-one reports)
      super-safe (filter safe somewhat-safe)]
  
  (println "Part 1:" (count super-safe))
  (println "Part 2:" (count somewhat-safe)))
