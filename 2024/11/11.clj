(ns aoc.2024.11.11
  (:require
   [aoc.common :refer [nums parse-input]]
   [clojure.math :as math]))

(def blink
  (memoize
   (fn [times stone]
     (let [bl (partial blink (dec times))]
       (cond (zero? times) 1
             (zero? stone) (bl 1)
             (odd? (long (math/log10 stone)))
             (let [s (str stone) h (/ (count s) 2)]
               (+ (bl (parse-long (subs s 0 h))) (bl (parse-long (subs s h)))))
             :else (bl (* stone 2024)))))))

(let [stones (parse-input nums)]
  (->> stones
       (map (partial blink 25))
       (apply +)
       (println "Part 1:"))

  (->> stones
       (map (partial blink 75))
       (apply +)
       (println "Part 2:")))