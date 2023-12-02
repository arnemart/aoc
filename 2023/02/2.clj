(ns aoc.2023.02.2
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(def maxes {:red 12 :green 13 :blue 14})

(let [games (as-> (read-input) input
              (map #(-> %
                        (str/replace #"^.+: " "[{")
                        (str/replace #"; " "} {")
                        (str/replace #"(\d+) ([a-z]+)" ":$2 $1")
                        (str "}]")) input)
              (str "[" (str/join input) "]")
              (eval (read-string input)))]

  (->> games
       (keep-indexed (fn [i draw]
                       (when (every? #(and
                                       (<= (get % :red 0) (:red maxes))
                                       (<= (get % :green 0) (:green maxes))
                                       (<= (get % :blue 0) (:blue maxes)))
                                     draw)
                         (inc i))))
       (apply +)
       (println "Part 1:"))

  (->> games
       (map #(->> %
                  (reduce (fn [[r g b] draw]
                            [(max r (get draw :red 0))
                             (max g (get draw :green 0))
                             (max b (get draw :blue 0))])
                          [0 0 0])
                  (apply *)))
       (apply +)
       (println "Part 2:")))