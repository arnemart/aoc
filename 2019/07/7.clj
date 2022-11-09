(ns aoc.2019.07.7
  (:require [aoc.2019.intcode :refer [run]]
            [aoc.common :refer [read-input]]
            [clojure.core.async :as async :refer [<!! >! chan close! go mult
                                                  tap timeout]]
            [clojure.math.combinatorics :as combo]))

(defn run-part1 [program inputs]
  (->> inputs
       (reduce #(->> program
                     (run [%2 %1])
                     :output
                     last) 0)))

(defn run-part2 [program inputs]
  (let [a (chan) b (chan)
        c (chan) d (chan)
        e (chan) e-out (chan)
        out (chan) m (mult e-out)]
    (tap m out)
    (tap m a false)
    (go (>! a (nth inputs 0)))
    (go (>! b (nth inputs 1)))
    (go (>! c (nth inputs 2)))
    (go (>! d (nth inputs 3)))
    (go (>! e (nth inputs 4)))
    (go (>! a 0))
    (go (run a b program))
    (go (run b c program))
    (go (run c d program))
    (go (run d e program))
    (go (run e e-out program (fn []
                               (<!! (timeout 50))
                               (close! out))))

    out))

(defn -main []
  (let [program (->>
                 (read-input :split-with #",")
                 (mapv parse-long))]

    (->> (combo/permutations (range 5))
         (map #(run-part1 program %))
         (apply max)
         (println "Part 1:"))

    (->> (combo/permutations (range 5 10))
         (map #(run-part2 program %))
         (map (fn [ch] (<!! (async/into [] ch))))
         (map last)
         (apply max)
         (println "Part 2:"))))

;; Part 1: 338603
;; Part 2: 63103596