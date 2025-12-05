(ns aoc.2025.05.5
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<$> <*> << dec-num many-till new-line* sep-by
                              sym*]]))

(defn in-range [ranges ingredient]
  (->> ranges
       (some (fn [[from to]] (<= from ingredient to)))))

(defn shrink-range [ranges range]
  (->> ranges
       (filter (partial not= range))
       (reduce (fn [[start end] [test-start test-end]]
                 (cond
                   (or (< end test-start) (> start test-end)) [start end]       ; outside, skip
                   (and (>= start test-start) (<= end test-end)) (reduced nil)  ; completely contained, delete
                   (<= end test-end) [start (dec test-start)]                   ; shrink from end
                   (>= start test-start) [(inc test-end) end]                   ; shrink from start
                   :else [start end]))
               range)))

(defn shrink-all-ranges [ranges]
  (loop [i 0 ranges (vec ranges)]
    (if (>= i (count ranges))
      ranges
      (let [shrinked (shrink-range ranges (nth ranges i))]
        (recur (inc i)
               (->> (assoc ranges i shrinked) (filter some?) vec))))))

(defn sum-ranges [ranges]
  (->> ranges
       (map (fn ([[from to]] (inc (- to from)))))
       (apply +)))

(defn iterate-until-stable
  ([f v] (iterate-until-stable f identity v))
  ([f test v]
   (reduce (fn [a b]
             (let [ra (test a) rb (test b)]
               (if (= ra rb) (reduced ra) b)))
           (iterate f v))))

(let [[ranges ingredients] (parse-input
                            (<*> (<$> set (many-till (<< (sep-by (sym* \-) dec-num) new-line*) new-line*))
                                 (lines dec-num)))]
  (->> ingredients
       (filter (partial in-range ranges))
       count
       (println "Part 1:"))

  (println "Part 2:" (iterate-until-stable shrink-all-ranges sum-ranges ranges)))