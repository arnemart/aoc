(ns aoc.2024.05.5
  (:require
   [aoc.common :refer [group-pairs lines nums parse-input]]
   [blancas.kern.core :refer [<$> <*> << dec-num many-till new-line* sep-by1 sym*]]
   [clojure.math :as math]))

(defn in-order [rules update]
  (->> update
       (partition 2 1)
       (every? #(get-in rules %))))

(defn middle [l]
  (nth l (math/floor (/ (count l) 2))))

(let [[rules updates] (parse-input (<*> (<$> group-pairs (many-till (<< (sep-by1 (sym* \|) dec-num) new-line*) new-line*))
                                        (lines nums)))
      {ordered true not-ordered false} (group-by (partial in-order rules) updates)]

  (->> ordered
       (map middle)
       (apply +)
       (println "Part 1:"))

  (->> not-ordered
       (map #(sort (fn [a b] (in-order rules [a b])) %))
       (map middle)
       (apply +)
       (println "Part 2:")))
