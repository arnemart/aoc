(ns aoc.2022.08.8
  (:require [aoc.common :refer [count-where read-input take-while+]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn trees-in-all-directions [y x h w forest]
  [(->> (range x) (map #(get-in forest [y %])) reverse)
   (->> (range y) (map #(get-in forest [% x])) reverse)
   (->> (range (inc x) w) (map #(get-in forest [y %])))
   (->> (range (inc y) h) (map #(get-in forest [% x])))])

(defn max-in-all-directions [y x h w forest]
  (->> (trees-in-all-directions y x h w forest)
       (map #(apply max %))))

(defn scenic-score [y x h w forest]
  (->> (trees-in-all-directions y x h w forest)
       (map (fn [trees] (take-while+ #(< % (get-in forest [y x])) trees)))
       (map count)
       (apply *)))

(let [forest (->> (read-input)
                  (map #(str/split % #""))
                  (mapv #(mapv parse-long %)))
      h (count forest)
      w (count (first forest))
      coords (combo/cartesian-product (range h) (range w))]

  (->> coords
       (map (fn [[y x]]
              (or (zero? y) (zero? x)
                  (= y (dec h)) (= x (dec w))
                  (some #(< % (get-in forest [y x])) (max-in-all-directions y x h w forest)))))
       (count-where true?)
       (println "Part 1:"))
  
  (->> coords
       (map (fn [[y x]] (scenic-score y x h w forest)))
       (apply max)
       (println "Part 2:")))
