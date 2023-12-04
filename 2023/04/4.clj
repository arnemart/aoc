(ns aoc.2023.04.4 
  (:require [aoc.common :refer [read-input]]
            [clojure.math.numeric-tower :refer [expt]]
            [clojure.set :as set]
            [clojure.string :as str]))

(let [wins (->> (read-input)
                (map #(str/replace % #".*:" ""))
                (map #(str/split % #"\|"))
                (mapv (fn [line]
                        (->> line
                             (map #(re-seq #"\d+" %))
                             (map #(map parse-long %))
                             (map set))))
                (map #(apply set/intersection %))
                (mapv count))

      won-cards-initial (vec (take (count wins) (repeat 1)))
      
      won-cards (->> (range (count wins))
                     (reduce (fn [cards card]
                               (->> (range (inc card) (+ card (get wins card) 1))
                                    (reduce (fn [cs c] (update cs c #(+ % (get cards card)))) cards)))
                             won-cards-initial))]

  (->> wins
       (filter #(> % 0))
       (map #(expt 2 (dec %)))
       (apply +)
       (println "Part 1:"))

  (->> won-cards
       (apply +)
       (println "Part 2:")))