(ns aoc.2022.18.18
  (:require [aoc.common :refer [count-where read-input sum zip]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(let [droplets (->> (read-input)
                    (map #(str/split % #","))
                    (map #(map parse-long %))
                    set)
      deltas (->> (combo/selections [0 1 -1] 3)
                  (filter #(= 2 (count-where zero? %))))
      maxes (->> droplets
                 (apply zip)
                 (map #(apply max %)))
      part1-sum (->> droplets
                     (map (fn [p]
                            (- 6 (->> deltas
                                      (map #(map sum (zip p %)))
                                      (map #(if (contains? droplets %) 1 0))
                                      sum))))
                     sum)]

  (println "Part 1:" part1-sum)

  (loop [enclosed (set (apply combo/cartesian-product (map range maxes)))]
    (let [new-enclosed (->> enclosed
                            (filter (fn [p]
                                      (->> deltas
                                           (every? #(let [pp (map sum (zip p %))]
                                                      (or (contains? droplets pp) (contains? enclosed pp)))))))
                            set)]
      (if (= (count enclosed) (count new-enclosed))
        (->> droplets
             (map (fn [p]
                    (- 6 (->> deltas
                              (map #(map sum (zip p %)))
                              (map #(if (or (contains? droplets %) (contains? enclosed %)) 1 0))
                              sum))))
             sum
             (println "Part 2:"))
        (recur new-enclosed)))))