(ns aoc.2024.05.5
  (:require
   [aoc.common :refer [lines nums parse-input]]
   [blancas.kern.core :refer [<*> << dec-num many-till new-line* sep-by1 sym*]]
   [clojure.math :as math]))

(defn in-order [rules update]
  (let [s (set update)]
    (every? (fn [[a b]] (or (or (not (contains? s a))
                                (not (contains? s b)))
                            (< (.indexOf update a) (.indexOf update b))))
            rules)))

(defn middle [l]
  (nth l (math/floor (/ (count l) 2))))


(let [[rules updates] (parse-input (<*> (many-till (<< (sep-by1 (sym* \|) dec-num) new-line*) new-line*) 
                                        (lines nums)))
      {ordered true not-ordered false} (group-by (partial in-order rules) updates)]

  (->> ordered
       (map middle)
       (apply +)
       (println "Part 1:"))

  (->> not-ordered
       (map #(sort (fn [a b] (in-order rules [b a])) %))
       (map middle)
       (apply +)
       (println "Part 2:")))