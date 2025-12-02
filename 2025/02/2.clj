(ns aoc.2025.02.2
  (:require
   [aoc.common :refer [inclusive-range parse-input sum]]
   [blancas.kern.core :refer [dec-num sep-by sym*]]))

(defn invalid-1 [n]
  (re-matches #"^(\d+)\1$" (str n)))

(defn invalid-2 [n]
  (re-matches #"^(\d+)\1+$" (str n)))

(let [input (parse-input (sep-by (sym* \,) (sep-by (sym* \-) dec-num)))
      ids (->> input
               (mapcat (partial apply inclusive-range)))]
  (->> ids
       (filter invalid-1)
       sum
       (println "Part 1:"))

  (->> ids
       (filter invalid-2)
       sum
       (println "Part 2:")))