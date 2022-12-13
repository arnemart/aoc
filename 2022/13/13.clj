(ns aoc.2022.13.13 
  (:require [aoc.common :refer [read-input sum]]
            [clojure.core.match :refer [match]]
            [clojure.edn :as edn]))

(defn compr [l r]
  (match [l r]
    [nil _] true
    [_ nil] false
    [[] []] nil
    [[] _] true
    [_ []] false
    [(a :guard int?) (b :guard int?)] (if (= a b) nil (< a b))
    [(a :guard int?) (b :guard vector?)] (compr [a] b)
    [(a :guard vector?) (b :guard int?)] (compr a [b])
    [[a & as] [b & bs]] (if-some [c (compr a b)] c (compr as bs))))

(let [packets (->> (read-input :split-with #"\n+")
                   (map edn/read-string))
      dp1 [[2]]
      dp2 [[6]]
      sorted (->> (conj packets dp1 dp2)
                  (sort compr))]

  (->> packets
       (partition 2)
       (keep-indexed #(when (apply compr %2) %1))
       (map inc)
       sum
       (println "Part 1:"))

  (->> [(.indexOf sorted dp1)
        (.indexOf sorted dp2)]
       (map inc)
       (apply *)
       (println "Part 2:")))