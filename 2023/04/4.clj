(ns aoc.2023.04.4 
  (:require [aoc.common :refer [read-input]]
            [clojure.math.numeric-tower :refer [expt]]
            [clojure.set :as set]))

(let [wins (->> (read-input)
                (map #(->> %
                          (re-find #"^.+:(.+)\|(.+)$")
                          (drop 1)
                          (map (partial re-seq #"\d+"))
                          (map set)))
                (map #(apply set/intersection %))
                (mapv count))
      
      won-cards (->> (range (count wins))
                     (reduce (fn [cards card]
                               (->> (range (inc card) (+ card (get wins card) 1))
                                    (reduce #(update %1 %2 + (get cards card)) cards)))
                             (vec (take (count wins) (repeat 1)))))]

  (->> wins
       (filter #(> % 0))
       (map #(expt 2 (dec %)))
       (apply +)
       (println "Part 1:"))

  (->> won-cards
       (apply +)
       (println "Part 2:")))