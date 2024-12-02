(ns aoc.2024.02.2 
  (:require
   [aoc.common :refer [parse-input zip]]
   [blancas.kern.core :refer [dec-num new-line* sep-by space]]))

(defn safe [report]
  (let [diffs (->> (zip report (drop 1 report))
                   (mapv (fn [[a b]] (- b a))))]
    (and
     (or (every? pos? diffs)
         (every? neg? diffs))
     (->> diffs
          (map abs)
          (every? #(<= % 3))))))

(defn safe2 [report]
  (or (safe report)
      (->> (range (count report))
           (map #(into (subvec report 0 %) (subvec report (inc %))))
           (some safe))))

(let [reports (parse-input (sep-by new-line* (sep-by space dec-num)))]
  (->> reports
       (filter safe)
       count
       (println "Part 1:"))

  (->> reports
       (filter safe2)
       count
       (println "Part 2:")))

