(ns aoc.2025.05.5
  (:require
   [aoc.common :refer [lines parse-input remove-index]]
   [blancas.kern.core :refer [<$> <*> << dec-num many-till new-line* sep-by sym*]]))

(defn in-range [ranges ingredient]
  (->> ranges
       (some (fn [[from to]] (<= from ingredient to)))))

(defn shrink-range [[start end] [_ test-end]]
  (cond
    (<= end test-end)   nil                  ; full overlapp
    (> start test-end)  [start end]          ; null overlapp 
    (<= start test-end) [(inc test-end) end] ; litt overlapp
    :else [start end]))

(defn shrink-all-ranges [ranges]
  (loop [i 1 ranges ranges]
    (if (>= i (count ranges))
      ranges
      (let [shrunk (shrink-range (nth ranges i) (nth ranges (dec i)))]
        (if (nil? shrunk)
          (recur i (remove-index ranges i))
          (recur (inc i) (assoc ranges i shrunk)))))))

(let [[ranges ingredients] (parse-input
                            (<*> (<$> (comp vec (partial sort-by first) set)
                                      (many-till (<< (sep-by (sym* \-) dec-num) new-line*) new-line*))
                                 (lines dec-num)))]
  (->> ingredients
       (filter (partial in-range ranges))
       count
       (println "Part 1:"))

  (->> ranges
       shrink-all-ranges
       (map #(inc (abs (apply - %1))))
       (apply +)
       (println "Part 2:")))