(ns aoc.2025.05.5
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<$> <*> << dec-num many-till new-line* sep-by sym*]]))

(defn in-range [ranges ingredient]
  (->> ranges
       (some (fn [[from to]] (<= from ingredient to)))))

(defn shrink-ranges [[first & rest]]
  (->> rest
       (reduce (fn [ranges [start end]]
                 (let [[_ test-end] (peek ranges)]
                   (cond
                     (<= end test-end)  ranges                                ; full overlapp
                     (> start test-end) (conj ranges [start end])             ; null overlapp
                     :else              (conj ranges [(inc test-end) end])))) ; litt overlapp
               [first])))

(let [[ranges ingredients] (parse-input
                            (<*> (<$> (partial sort-by first)
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