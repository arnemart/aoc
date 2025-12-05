(ns aoc.2025.05.5
  (:require
   [aoc.common :refer [lines parse-input remove-index]]
   [blancas.kern.core :refer [<$> <*> << dec-num many-till new-line* sep-by sym*]]))

(defn in-range [ranges ingredient]
  (->> ranges
       (some (fn [[from to]] (<= from ingredient to)))))

(defn shrink-ranges [ranges]
  (loop [i 1 ranges ranges]
    (if (>= i (count ranges))
      ranges
      (let [[start end] (nth ranges i)
            [_ test-end] (nth ranges (dec i))]
        (cond
          (<= end test-end)  (recur i (remove-index ranges i))                          ; full overlapp
          (> start test-end) (recur (inc i) ranges)                                     ; null overlapp
          :else              (recur (inc i) (assoc ranges i [(inc test-end) end]))))))) ; litt overlapp

(let [[ranges ingredients] (parse-input
                            (<*> (<$> (comp vec (partial sort-by first))
                                      (many-till (<< (sep-by (sym* \-) dec-num) new-line*) new-line*))
                                 (lines dec-num)))]
  (->> ingredients
       (filter (partial in-range ranges))
       count
       (println "Part 1:"))

  (->> ranges
       shrink-ranges
       (map #(inc (abs (apply - %1))))
       (apply +)
       (println "Part 2:")))