(ns aoc.2025.01.1
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<*> dec-num one-of*]]
   [clojure.math :refer [floor]]))

(let [turns (->> (parse-input (lines (<*> (one-of* "LR") dec-num)))
                 (map (fn [[dir dist]] (if (= \L dir) (- dist) dist))))

      zeroes-1 (->> turns
                    (reduce (fn [[prev zeroes] d]
                              (let [next (mod (+ prev d) 100)]
                                [next (if (= 0 next) (inc zeroes) zeroes)])) [50 0]) 
                    last)

      zeroes-2 (->> turns
                    (reduce (fn [[prev zeroes] d]
                              (let [next (+ prev d)]
                                [(mod next 100)
                                 (+ zeroes
                                    (if (= 0 next) 1 (+ (int (floor (/ (abs next) 100)))
                                                        (if (and (< next 0) (not= 0 prev)) 1 0))))]))
                            [50 0])
                    last)]

  (println "Part 1:" zeroes-1)
  (println "Part 2:" zeroes-2))
