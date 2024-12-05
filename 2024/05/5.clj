(ns aoc.2024.05.5 
  (:require
   [aoc.common :refer [lines nums read-input-str]]
   [blancas.kern.core :refer [dec-num sep-by1 sym* value]]
   [clojure.math :as math]
   [clojure.string :as str]))

(defn in-order [rules update]
  (let [s (set update)]
    (every? (fn [[a b]] (or (or (not (contains? s a))
                                (not (contains? s b)))
                            (< (.indexOf update a) (.indexOf update b))))
            rules)))

(defn middle [l]
  (nth l (math/floor (/ (count l) 2))))

(let [[rules-str updates-str] (str/split (read-input-str) #"\n\n")
      rules (value (lines (sep-by1 (sym* \|) dec-num)) rules-str)
      updates (value (lines nums) updates-str)
      { ordered true not-ordered false} (group-by (partial in-order rules) updates)]
  
  (->> ordered
       (map middle)
       (apply +)
       (println "Part 1:"))
  
  (->> not-ordered
       (map #(sort (fn [a b] (in-order rules [b a])) %))
       (map middle)
       (apply +)
       (println "Part 2:")))