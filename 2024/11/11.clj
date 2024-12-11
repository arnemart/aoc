(ns aoc.2024.11.11
  (:require
   [aoc.common :refer [nums parse-input]]
   [clojure.math :as math]))

(def blink
  (memoize
   (fn [times stone]
     (if (= 0 times) 1
         (let [t1 (dec times)]
           (cond (zero? stone) (blink t1 1)
                 (odd? (long (math/log10 stone)))
                 (let [s (str stone) h (/ (count s) 2)]
                   (+ (blink t1 (parse-long (subs s 0 h))) (blink t1 (parse-long (subs s h)))))
                 :else (blink t1 (* stone 2024))))))))

(let [stones (parse-input nums)]
  (->> stones
       (map (partial blink 25))
       (apply +)
       (println "Part 1:"))

  (->> stones
       (map (partial blink 75))
       (apply +)
       (println "Part 2:")))