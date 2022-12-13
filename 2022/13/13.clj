(ns aoc.2022.13.13 
  (:require [aoc.common :refer [read-input sum tee]]
            [clojure.core.match :refer [match]]
            [clojure.edn :as edn]))

(defn compr [l r]
  (match [l r]
    [[] []] 0
    [[] _] -1
    [_ []] 1
    [(a :guard int?) (b :guard int?)] (compare a b)
    [(a :guard int?) (b :guard vector?)] (compr [a] b)
    [(a :guard vector?) (b :guard int?)] (compr a [b])
    [[a & as] [b & bs]] (let [c (compr a b)] (if (= 0 c) (compr as bs) c))))

(let [packets (->> (read-input :split-with #"\n+")
                   (map edn/read-string))
      dp1 [[2]]
      dp2 [[6]]]

  (->> packets
       (partition 2)
       (keep-indexed #(when (< (apply compr %2) 0) %1))
       (map inc)
       sum
       (println "Part 1:"))

  (->> (conj packets dp1 dp2)
       (sort compr)
       (tee [#(.indexOf % dp1)
             #(.indexOf % dp2)])
       (map inc)
       (apply *)
       (println "Part 2:")))