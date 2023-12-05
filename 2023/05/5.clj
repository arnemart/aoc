(ns aoc.2023.05.5 
  (:require [aoc.common :refer [read-input split-to-ints tee]]
            [clojure.string :as str]))

(defn convert [n ms]
  (reduce (fn [n [dest source len]]
            (let [newn (if (<= source n (+ source len -1))
                         (+ n (- dest source))
                         n)]
              (if (= n newn)
                n
                (reduced newn)))) n ms))

(defn in-ranges [n ranges]
  (->> ranges
       (some (fn [[a b]] (<= a n b)))))

(let [[seeds maps] (->> (read-input :split-with #"\n\n")
                        (tee [#(split-to-ints (first %))
                              #(->> (drop 1 %)
                                    (map (fn [m]
                                           (->> (str/split-lines m)
                                                (drop 1)
                                                (map split-to-ints)))))]))
      reverse-maps (->> maps
                        reverse
                        (map #(map (fn [[dest source len]]
                                     [source dest len]) %)))
      seed-ranges (->> seeds
                       (partition 2)
                       (map (fn [[a b]] (list a (+ a b -1)))))]

  (->> seeds
       (map #(reduce convert % maps))
       (apply min)
       (println "Part 1:"))

  (->> (range)
       (filter #(in-ranges (reduce convert % reverse-maps) seed-ranges))
       first
       (println "Part 2:")))