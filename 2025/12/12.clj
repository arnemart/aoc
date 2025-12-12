(ns aoc.2025.12.12
  (:require
   [aoc.common :refer [lines nums points read-input]]
   [blancas.kern.core :refer [<$> <*> >> dec-num new-line* space sym* value]]))

(defn region-large-enough [shapes [w h s]]
  (let [region-area (* w h)
        shape-area (->> s
                        (map-indexed #(* (count (nth shapes %1)) %2))
                        (apply +))]
    (< shape-area region-area)))

(let [parts (read-input {:split-with #"\n\n"})
      shapes (->> (drop-last parts)
                  (map (partial value (>> (<*> dec-num (sym* \:) new-line*)
                                          (<$> #(->> % (filter (fn [[v]] (= \# v))) (map (fn [[_ [y x]]] [(dec y) x])))
                                               points)))))
      regions (value (lines (<*> dec-num (>> (sym* \x) dec-num) (>> (sym* \:) space nums))) (last parts))]

  (->> regions
       (filter #(region-large-enough shapes %))
       count
       (println "Part 1:")))