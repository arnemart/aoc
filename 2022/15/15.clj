(ns aoc.2022.15.15
  (:require [aoc.common :refer [inclusive-range manhattan read-input]]
            [clojure.set :as set]))

(defn find-available-spots [sensors]
  (->> sensors
       (filter (fn [[[_ sy] _ d]]
                 (<= (- sy d) 2000000 (+ sy d))))
       (reduce (fn [m [[sx sy] _ d]]
                 (let [to-2m (- d (abs (- 2000000 sy)))]
                   (->> (inclusive-range (- sx to-2m) (+ sx to-2m))
                        (reduce conj m)))) #{})))

(defn find-outside [points [[sx sy] _ d]]
  (->> (range (+ 2 d))
       (reduce #(let [dx (- (inc d) %2) dy %2]
                  (->> [[(+ sx dx) (+ sy dy)]
                        [(+ sx dx) (- sy dy)]
                        [(- sx dx) (+ sy dy)]
                        [(- sx dx) (- sy dy)]]
                       (filter (fn [[x y]]
                                 (and (>= x 0)
                                      (>= y 0)
                                      (<= x 4000000)
                                      (<= y 4000000))))
                       (map (fn [[x y]] (+ y (* 4000000 x))))
                       (reduce conj %1))) points)))

(let [sensors (->> (read-input)
                   (map #(re-seq #"\-?\d+" %))
                   (map #(map parse-long %))
                   (map (fn [[sx sy bx by]] [[sx sy] [bx by] (manhattan [sx sy] [bx by])])))
      beacons-2000000-x (->> sensors
                             (map #(nth % 1))
                             (filter #(= 2000000 (last %)))
                             (map first)
                             set)
      x-2000000 (find-available-spots sensors)
      outside-points (->> sensors
                          (reduce find-outside #{}))
      [x y] (->> outside-points
                 vec
                 (some #(let [x (quot % 4000000) y (mod % 4000000)]
                          (when (every? (fn [[s _ d]] (> (manhattan s [x y]) d)) sensors)
                            [x y]))))]

  (->> (set/difference x-2000000 beacons-2000000-x)
       count
       (println "Part 1:"))

  (println "Part 2:" (+ y (* x 4000000))))