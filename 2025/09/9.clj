(ns aoc.2025.09.9
  (:require
   [aoc.common :refer [inclusive-range lines nums parse-input zip]]
   [clojure.math.combinatorics :refer [combinations]]))

(defn all-corners [[[x1 y1] [x2 y2]]]
  [[(min x1 x2) (min y1 y2)]
   [(max x1 x2) (min y1 y2)]
   [(min x1 x2) (max y1 y2)]
   [(max x1 x2) (max y1 y2)]])

(defn all-points-in-rectangle [[[x1 y1] [x2 y2]]]
  (->> [(->> (inclusive-range x1 x2) (mapcat (fn [x] [[x y1] [x y2]])))
        (->> (inclusive-range y1 y2) (mapcat (fn [y] [[x1 y] [x2 y]])))]
       (apply concat)))

(defn square [pair]
  (let [[[x1 y1] _ _ [x2 y2]] (all-corners pair)]
    (* (- (inc x2) x1)
       (- (inc y2) y1))))

(defn inside [walls corners y-walls y-corners p]
  (->> (all-points-in-rectangle p)
       (concat (all-corners p)) ; check the corners first
       (every? (fn [[x y]]
                 (or (contains? walls [x y])
                     (contains? corners [x y])
                     (let [walls-left   (->> (get y-walls y)   (filter (fn [[wx]] (< wx x))))
                           corners-left (->> (get y-corners y) (filter (fn [[wx]] (< wx x))))
                           wlu (->> walls-left   (filter #(= \^ (last %))) count)
                           wld (->> walls-left   (filter #(= \v (last %))) count)
                           clu (->> corners-left (filter #(= \^ (last %))) count)
                           cld (->> corners-left (filter #(= \v (last %))) count)]
                       (odd? (+ (- wlu wld) (/ (- clu cld) 2)))))))))

(defn exclusive-range [a b]
  (range (inc (min a b)) (max a b)))

(time
 (let [points (parse-input (lines nums))
       [walls corners] (->> points
                            cycle
                            (drop 1)
                            (zip points)
                            (reduce (fn [[walls corners] [[x1 y1] [x2 y2]]]
                                      (let [dir (cond (> y1 y2) \^ (< y1 y2) \v :else \_)]
                                        [(if (= x1 x2)
                                           (->> (exclusive-range y1 y2)
                                                (map #(vector x1 % dir))
                                                (reduce conj walls))
                                           (->> (exclusive-range x1 x2)
                                                (map #(vector % y1 dir))
                                                (reduce conj walls)))
                                         (-> corners (conj [x1 y1 dir]) (conj [x2 y2 dir]))]))
                                    [#{} #{}]))
       dirless-walls (->> walls (map drop-last) set)
       dirless-corners (->> corners (map drop-last) set)
       y-walls (group-by #(nth % 1) walls)
       y-corners (group-by #(nth % 1) corners)
       sorted (->> (combinations points 2)
                   (sort-by square)
                   reverse)]
   (->> sorted
        first
        square
        (println "Part 1:"))

   (->> sorted
        (some #(when (inside dirless-walls dirless-corners y-walls y-corners %) %))
        square
        (println "Part 2:"))))
