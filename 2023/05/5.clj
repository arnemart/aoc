(ns aoc.2023.05.5 
  (:require [aoc.common :refer [read-input split-to-ints tee]]
            [clojure.string :as str]))

(defn convert [n ms]
  (reduce (fn [n [from to dest]]
            (if (<= from n to)
              (reduced (+ n (- dest from)))
              n)) n ms))

(defn in-ranges [n ranges]
  (->> ranges
       (some (fn [[a b]] (<= a n b)))))

(let [[seeds maps] (->> (read-input :split-with #"\n\n")
                        (tee [#(->> % first split-to-ints)
                              #(->> % rest
                                    (map (fn [m]
                                           (->> (str/split-lines m)
                                                (drop 1)
                                                (map split-to-ints)))))]))
      forward-maps (->> maps
                        (map #(map (fn [[dest source len]]
                                     [source (+ source len -1) dest]) %)))
      reverse-maps (->> maps
                        reverse
                        (map #(map (fn [[source dest len]]
                                     [source (+ source len -1) dest]) %))) 
      seed-ranges (->> seeds
                       (partition 2)
                       (map (fn [[from len]] 
                              [from (+ from len -1)])))]

  (->> seeds
       (map #(reduce convert % forward-maps))
       (apply min)
       (println "Part 1:"))

  (->> (range)
       (filter #(in-ranges (reduce convert % reverse-maps) seed-ranges))
       first
       (println "Part 2:")))