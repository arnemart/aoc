(ns aoc.2023.05.5 
  (:require [aoc.common :refer [read-input split-to-ints tee]]
            [clojure.string :as str]))

(defn convert-single [n [dest source len]]
  (if (<= source n (+ source (dec len)))
    (+ n (- dest source))
    n))

(defn convert [n ms]
  (reduce #(let [newn (convert-single %1 %2)]
             (if (= n newn)
               n
               (reduced newn))) n ms))

(defn in-seeds [n seeds]
  (->> seeds
       (partition 2)
       (some (fn [[a b]] (<= a n (+ a (dec b)))))))

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
                                     [source dest len]) %)))]

  (->> seeds
       (map #(reduce convert % maps))
       (apply min)
       (println "Part 1:"))

  (->> (range)
       (filter #(in-seeds (reduce convert % reverse-maps) seeds))
       first
       (println "Part 2:")))