(ns aoc.2024.22.22
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [dec-num]]))

(defn secret [n]
  (let [n1 (-> (* 64 n)
               (bit-xor n)
               (mod 16777216))
        n2 (-> (quot n1 32)
               (bit-xor n1)
               (mod 16777216))]
    (-> (* n2 2048)
        (bit-xor n2)
        (mod 16777216))))

(defn diffs [secrets]
  (->> secrets
       (map #(mod % 10))
       (partition 2 1)
       (map (fn [[a b]] [b (- b a)]))))

(defn count-bananas [diffs changes]
  (->> diffs
       (map (fn [d]
              (->> d
                   (partition 4 1)
                   (some (fn [[[_ a] [_ b] [_ c] [n d]]]
                           (when (= changes [a b c d]) n))))))
       (filter some?)
       (apply +)))

(defn candidates [diffs]
  (->> diffs
       (partition 4 1)
       (filter (fn [[_ _ _ [d _]]] (>= d 8)))
       (map #(map last %))))

(let [secret-numbers (parse-input (lines dec-num))
      two-thousand (->> secret-numbers
                        (map #(take 2001 (iterate secret %))))
      diffs (->> two-thousand
                 (map diffs))
      change-candidates (->> diffs
                             (map candidates)
                             (apply concat)
                             frequencies
                             (filter (fn [[_ c]] (> c 110)))
                             (map first)
                             (filter #(> (apply + %) 0)))]
  (->> two-thousand
       (map last)
       (apply +)
       (println "Part 1:"))

  (->> change-candidates
       (pmap (partial count-bananas diffs))
       (apply max)
       (println "Part 2:")))

