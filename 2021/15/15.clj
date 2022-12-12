(ns aoc.2021.15.15
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn find-neighbors [max-x max-y]
  (fn [[x, y]]
    (->> [[(inc x), y]
          [x, (inc y)]
          [(dec x), y]
          [x, (dec y)]]
         (filter (fn [[x, y]]
                   (and (>= x 0)
                        (>= y 0)
                        (<= x max-x)
                        (<= y max-y)))))))

(defn find-path [grid]
  (let [max-x (dec (count (first grid)))
        max-y (dec (count grid))]
    (:cost (astar :start [0 0]
                  :is-end #(= [max-x max-y] %)
                  :get-neighbors (find-neighbors max-x max-y)
                  :calculate-cost (fn [_ [x y]] (get-in grid [y x]))
                  :heuristic (fn [[x y]] (+ (- max-x x) (- max-y y)))))))

(let [ceiling (->> (read-input)
                   (mapv (fn [line]
                           (as-> line l
                             (str/split l #"")
                             (mapv parse-long l)))))]
  (println "Part 1:" (find-path ceiling)))