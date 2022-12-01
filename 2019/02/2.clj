(ns aoc.2019.02.2
  (:require [aoc.common :refer [read-input]]
            [aoc.2019.intcode :refer [run]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn run-verb-noun [[verb noun] program]
  (-> program
      (assoc 1 verb 2 noun)
      run
      :mem
      (get 0)))

(let [program
      (->> (read-input :split-with #",")
           (mapv parse-long))]

  (->> program
       (run-verb-noun [12 2])
       (println "Part 1:"))

  (->> (combo/permuted-combinations (range 100) 2)
       (filter #(= 19690720 (run-verb-noun % program)))
       first
       str/join
       (println "Part 2:")))

;; Part 1: 3850704
;; Part 2: 6718