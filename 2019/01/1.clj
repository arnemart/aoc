(ns aoc.2019.01.1
  (:require [aoc.common :refer [read-input]]))

(defn calculate-fuel [mass] (-> mass (quot 3) (- 2)))

(defn rocket-equation [mass]
  (let [newmass (calculate-fuel mass)]
    (+ mass (if (> newmass 0) (rocket-equation newmass) 0))))

(let [fuel
      (->> (read-input)
           (map parse-long)
           (map calculate-fuel))]

  (->> fuel
       (apply +)
       (println "Part 1:"))

  (->> fuel
       (map rocket-equation)
       (apply +)
       (println "Part 2:")))
