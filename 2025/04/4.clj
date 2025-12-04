(ns aoc.2025.04.4
  (:require
   [aoc.common :refer [parse-input points]]
   [clojure.math.combinatorics :refer [selections]]))

(defn count-neighbors [grid [y x]]
  (->> (selections [-1 0 1] 2)
       (filter (partial not= [0 0]))
       (map (fn [[dy dx]]
              (get grid [(+ y dy) (+ x dx)])))
       (filter some?)
       count))

(defn remove-rolls [grid]
  (->> grid
       (filter #(>= (count-neighbors grid %1) 4))
       set))

(let [start-grid (->> (parse-input points)
                      (filter #(= \@ (first %1)))
                      (map last)
                      set)
      final-grid (loop [grid start-grid]
                   (let [next-grid (remove-rolls grid)]
                     (if (= next-grid grid)
                       grid
                       (recur next-grid))))]

  (->> start-grid
       (filter #(< (count-neighbors start-grid %1) 4))
       count
       (println "Part 1:"))

  (println "Part 2:" (- (count start-grid) (count final-grid))))