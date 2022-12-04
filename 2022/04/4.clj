(ns aoc.2022.04.4
  (:require [aoc.common :refer [count-where read-input]]
            [clojure.string :as str]))

(let [assignments (->> (read-input)
                       (map #(str/split % #"[,-]"))
                       (map #(map parse-long %)))]
  (->> assignments
       (count-where (fn [[a b c d]]
                      (or (and (<= a c) (>= b d))
                          (and (<= c a) (>= d b)))))
       (println "Part 1:"))

  (->> assignments
       (count-where (fn [[a b c d]]
                      (or (<= c a d)
                          (<= c b d)
                          (<= a c b)
                          (<= a d b))))
       (println "Part 2:")))