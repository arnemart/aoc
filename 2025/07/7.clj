(ns aoc.2025.07.7
  (:require
   [aoc.common :refer [read-input]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn is-beam [v]
  (or (number? v)
      (= \S v)))

(defn should-split [grid y x]
  (and (= \^ (get-in grid [y x]))
       (is-beam (get-in grid [(dec y) x]))))

(defn split-beams [grid [y x]]
  (if (= \. (get-in grid [y x]))
    (let [above       (get-in grid [(dec y) x])
          beams-above (if (number? above) above 0)
          above-left  (get-in grid [(dec y) (dec x)])
          above-right (get-in grid [(dec y) (inc x)])
          split-left  (should-split grid y (dec x))
          split-right (should-split grid y (inc x))]
      (cond
        (and split-left split-right) (assoc-in grid [y x] (+ above-left above-right beams-above))
        split-left                   (assoc-in grid [y x] (+ above-left beams-above))
        split-right                  (assoc-in grid [y x] (+ above-right beams-above))
        (is-beam above)              (assoc-in grid [y x] (if (number? above) above 1))
        :else grid))
    grid))

(let [grid (->> (read-input) (map (comp vec seq)) vec)
      search-coords (cartesian-product (range 1 (count grid)) (range (count (first grid))))
      grid-with-beams (->> search-coords
                           (reduce split-beams grid))]

  (->> search-coords
       (filter (fn [[y x]]
                 (and (= \^ (get-in grid-with-beams [y x]))
                      (is-beam (get-in grid-with-beams [(dec y) x])))))
       count
       (println "Part 1:"))

  (->> grid-with-beams
       last
       (filter number?)
       (apply +)
       (println "Part 2:")))