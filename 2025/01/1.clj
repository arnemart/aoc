(ns aoc.2025.01.1
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<$> <*> dec-num one-of*]]))

(let [turns (->> (parse-input (lines (<*> (<$> #(get {\L - \R +} %1) (one-of* "LR")) dec-num)))
                 (map (comp eval seq)))

      zeroes (->> turns
                  (reduce (fn [[prev zeroes-1 zeroes-2] d]
                            (let [next (+ prev d)
                                  nextmod (mod next 100)]
                              [nextmod
                               (if (= 0 nextmod) (inc zeroes-1) zeroes-1)
                               (+ zeroes-2
                                  (if (= 0 next) 1
                                      (+ (quot (abs next) 100)
                                         (if (and (< next 0) (not= 0 prev)) 1 0))))]))
                          [50 0 0])
                  (drop 1))]

  (println "Part 1:" (first zeroes))
  (println "Part 2:" (last zeroes)))
