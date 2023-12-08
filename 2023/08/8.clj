(ns aoc.2023.08.8
  (:require [aoc.common :refer [read-input]]
            [clojure.math.numeric-tower :refer [lcm]]
            [clojure.string :as str]))

(defn solve [start test dirs nodes]
  (loop [cur start [d & ds] dirs steps 0]
    (if (test cur) steps
        (recur (get-in nodes [cur d]) ds (inc steps)))))

(let [[dirs-str nodes-str] (read-input :split-with #"\n\n")
      dirs (->> (str/split dirs-str #"")
                (map #(if (= "L" %) 0 1))
                cycle)
      nodes (->> (str/split nodes-str #"\n")
                 (map #(re-seq #"\w+" %))
                 (map (fn [[a b c]] [a [b c]]))
                 (into {}))
      ends-with-z #(= \Z (last %))]

  (println "Part 1:" (solve "AAA" #(= "ZZZ" %) dirs nodes))

  (->> nodes
       keys
       (filter #(= \A (last %)))
       (map #(solve % ends-with-z dirs nodes))
       (reduce lcm)
       (println "Part 2:")))