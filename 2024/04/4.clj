(ns aoc.2024.04.4 
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<$> letter many]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn find-letter [grid letter]
  (let [w (count (first grid))
        h (count grid)]
    (->> (cartesian-product (range h) (range w))
         (filter #(= letter (get-in grid %))))))

(defn find-in-grid [grid y x c dy dx]
  (= c (get-in grid [(+ y dy) (+ x dx)])))

(defn find-xmas [grid [y x]]
  (let [🎅 (partial find-in-grid grid y x)]
    (->>
     [(and (🎅 :M  0  1) (🎅 :A  0  2) (🎅 :S  0  3)) ; e
      (and (🎅 :M  1  1) (🎅 :A  2  2) (🎅 :S  3  3)) ; se
      (and (🎅 :M  1  0) (🎅 :A  2  0) (🎅 :S  3  0)) ; s
      (and (🎅 :M  1 -1) (🎅 :A  2 -2) (🎅 :S  3 -3)) ; sw
      (and (🎅 :M  0 -1) (🎅 :A  0 -2) (🎅 :S  0 -3)) ; w
      (and (🎅 :M -1 -1) (🎅 :A -2 -2) (🎅 :S -3 -3)) ; nw
      (and (🎅 :M -1  0) (🎅 :A -2  0) (🎅 :S -3  0)) ; n
      (and (🎅 :M -1  1) (🎅 :A -2  2) (🎅 :S -3 3))] ; ne
     (filter true?)
     count)))

(defn find-x-mas [grid [y x]]
  (let [🤶 (partial find-in-grid grid y x)]
    (and (or (and (🤶 :M -1 -1) (🤶 :S  1  1))
             (and (🤶 :M  1  1) (🤶 :S -1 -1)))
         (or (and (🤶 :M  1 -1) (🤶 :S -1  1))
             (and (🤶 :M -1  1) (🤶 :S  1 -1))))))

(let [grid (parse-input (lines (many (<$> (comp keyword str) letter))))
      xes (find-letter grid :X)
      as (find-letter grid :A)]

  (->> xes
       (map (partial find-xmas grid))
       (apply +)
       (println "Part 1:"))

  (->> as
       (filter (partial find-x-mas grid)) 
       count
       (println "Part 2:")))
