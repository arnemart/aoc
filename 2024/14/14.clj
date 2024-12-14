(ns aoc.2024.14.14 
  (:require
   [aoc.common :refer [dec-num- draw-image parse-input]]
   [blancas.kern.core :refer [many search]]) 
  (:import
   [java.awt Color]))

(defn move-robot [[x y dx dy]]
  [(mod (+ x dx) 101) (mod (+ y dy) 103) dx dy])

(defn partition-robots [robots]
  (->> robots
       (filter (fn [[x y]] (and (not= x 50) (not= y 51))))
       (group-by (fn [[x y]] [(< x 50) (< y 51)]))
       (map (fn [[_ r]] (count r)))))

(let [robots (->> (parse-input (many (search dec-num-)))
                  (partition 4))]

  (loop [robots robots i 0]
    (when (= 100 i)
      (->> robots
           partition-robots
           (apply *)
           (println "Part 1:")))

    (when (= 0 (mod (- i 23) 101))
      (draw-image
       202 206 i
       #(do (.setColor % Color/GREEN)
            (doseq [[x y] robots]
              (.fillRect % (* 2 x) (* 2 y) 2 2)))))

    (if (= (count robots) (->> robots
                               (map #(take 2 %))
                               set
                               count))
      (println "Part 2:" i)
      (recur (map move-robot robots) (inc i)))))