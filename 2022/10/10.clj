(ns aoc.2022.10.10
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]
            [clojure.core.match :refer [match]]))

(let [cycles (reduce (fn [l op]
                       (let [prev (peek l)]
                         (match (str/split op #" ")
                           ["noop"] (conj l prev)
                           ["addx" s] (conj l prev (+ prev (parse-long s))))))
                     [1]
                     (read-input))]

  (->> (range 20 (count cycles) 40)
       (map #(* % (nth cycles (dec %))))
       sum
       (println "Part 1:"))

  (println "Part 2:")
  (->> cycles
       (map-indexed #(if (<= (abs (- %2 (mod %1 40))) 1) "#" " "))
       (partition 40)
       (map str/join)
       (str/join "\n")
       println))