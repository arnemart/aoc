(ns aoc.2022.08.8
  (:require [aoc.common :refer [count-where read-input take-until]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn trees-in-all-directions [y x h w forest]
  [(->> (range x) (map #(get-in forest [y %])) reverse)
   (->> (range y) (map #(get-in forest [% x])) reverse)
   (->> (range (inc x) w) (map #(get-in forest [y %])))
   (->> (range (inc y) h) (map #(get-in forest [% x])))])

(defn max-in-all-directions [y x h w forest]
  (->> (trees-in-all-directions y x h w forest)
       (map #(apply max %))
       (apply min)))

(defn scenic-score [[y x] h w forest]
  (->> (trees-in-all-directions y x h w forest)
       (map (fn [trees] (take-until #(>= % (get-in forest [y x])) trees)))
       (map count)
       (apply *)))

(let [forest (->> (read-input)
                  (map #(str/split % #""))
                  (mapv #(mapv parse-long %)))
      h (count forest)
      w (count (first forest))
      coords (combo/cartesian-product (range h) (range w))]

  (->> coords
       (count-where (fn [[y x]]
                      (or (zero? y) (zero? x)
                          (= y (dec h)) (= x (dec w))
                          (< (max-in-all-directions y x h w forest) (get-in forest [y x])))))
       (println "Part 1:"))
  
  (->> coords
       (map #(scenic-score % h w forest))
       (apply max)
       (println "Part 2:")))