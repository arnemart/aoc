(ns aoc.2025.02.2
  (:require
   [aoc.common :refer [inclusive-range parse-input sum]]
   [blancas.kern.core :refer [dec-num sep-by sym*]]))

(defn valid [ids re]
  (->> ids
       (filter #(re-matches re (str %1)))
       sum))

(let [input (parse-input (sep-by (sym* \,) (sep-by (sym* \-) dec-num)))
      ids (->> input
               (mapcat (partial apply inclusive-range)))]
  
  (println "Part 1:" (valid ids #"^(\d+)\1$"))
  (println "Part 2:" (valid ids #"^(\d+)\1+$")))