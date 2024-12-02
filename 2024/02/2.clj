(ns aoc.2024.02.2 
  (:require
   [aoc.common :refer [parse-input zip]]
   [blancas.kern.core :refer [dec-num new-line* sep-by space]]))

(defn safe [report]
  (let [diffs (->> (zip report (drop 1 report))
                   (map (fn [[a b]] (- b a))))]
    (or (every? #(<= 1 % 3) diffs)
        (every? #(>= -1 % -3) diffs))))

(defn safe2 [report]
  (or (safe report)
      (->> (range (count report))
           (map #(into (subvec report 0 %) (subvec report (inc %))))
           (some safe))))

(let [reports (parse-input (sep-by new-line* (sep-by space dec-num)))
      somewhat-safe (filter safe2 reports)
      super-safe (filter safe somewhat-safe)]
  
  (println "Part 1:" (count super-safe))
  (println "Part 2:" (count somewhat-safe)))
