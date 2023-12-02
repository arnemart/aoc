(ns aoc.2023.02.2
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def maxes {:red 12 :green 13 :blue 14})

(let [games (->> (read-input)
                 (map #(-> %
                           (str/split #": ")
                           last
                           (str/split #"; ")))
                 (map (fn [g]
                        (->> g
                             (map #(str/replace % #"(\d+) ([a-z]+)" ":$2 $1"))
                             (map #(eval (read-string (str "{" % "}"))))))))]

  (->> games
       (keep-indexed #(when (every? (fn [draw]
                                      (and
                                       (>= (:red maxes) (get draw :red 0))
                                       (>= (:green maxes) (get draw :green 0))
                                       (>= (:blue maxes) (get draw :blue 0))))
                                    %2)
                        (inc %1)))
       (apply +)
       (println "Part 1:"))

  (->> games
       (map (fn [game]
              (->> game
                   (reduce (fn [[r g b] draw]
                             [(max r (get draw :red 0))
                              (max g (get draw :green 0))
                              (max b (get draw :blue 0))])
                           [0 0 0])
                   (apply *))))
       (apply +)
       (println "Part 2:")))