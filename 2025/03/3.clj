(ns aoc.2025.03.3
  (:require
   [aoc.common :refer [digit-num lines parse-input sum]]
   [blancas.kern.core :refer [many]]))

(defn max-indexed [nums]
  (->> nums
       (map-indexed #(vector %1 %2))
       (reduce (fn [[max-i max-n] [i n]]
                 (if (> n max-n)
                   [i n]
                   [max-i max-n]))
               [-1 -1])))

(defn joltage [more nums]
  (if (zero? more)
    ""
    (let [[first-i first-j] (->> nums (drop-last (dec more)) max-indexed)
          next (joltage (dec more) (drop (inc first-i) nums))]
      (parse-long (str first-j next)))))

(let [input (parse-input (lines (many digit-num)))]
  (->> input
       (map (partial joltage 2))
       sum
       (println "Part 1:"))
  (->> input
       (map (partial joltage 12))
       sum
       (println "Part 2:")))