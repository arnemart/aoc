(ns aoc.2019.01.1
  (:require [aoc.common :refer [read-input sum]]))

(defn calculate-fuel [mass] (-> mass (quot 3) (- 2)))

(defn rocket-equation [mass]
  (let [newmass (calculate-fuel mass)]
    (+ mass (if (> newmass 0) (rocket-equation newmass) 0))))

(let [fuel (->> (read-input)
                (map parse-long)
                (map calculate-fuel))]

  (println "Part 1:" (sum fuel))

  (->> fuel
       (map rocket-equation)
       sum
       (println "Part 2:")))
