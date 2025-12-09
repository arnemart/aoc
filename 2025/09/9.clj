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

(defn largest-square [pairs]
  (->> pairs
       (map square)
       (apply max)))

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

       [[_ [div-x]]] (->> points
                          cycle
                          (drop 1)
                          (zip points)
                          (filter (fn [[[x1] [x2]]]
                                    (> (abs (- x1 x2)) 10000))))

       [div1 div2] (->> points
                        (filter #(= div-x (first %)))
                        sort)
       above (->> points
                  (filter (fn [[_ y]]
                            (<= y (last div1))))
                  (map #(vector div1 %)))
       below (->> points
                  (filter (fn [[_ y]]
                            (>= y (last div2))))
                  (map #(vector div2 %)))

       dirless-walls (->> walls (map drop-last) set)
       dirless-corners (->> corners (map drop-last) set)
       y-walls (group-by #(nth % 1) walls)
       y-corners (group-by #(nth % 1) corners)]

   (->> (combinations points 2)
        largest-square
        (println "Part 1:"))

   (->> [above, below]
        (map (fn [p] (->> p
                          (sort-by square)
                          reverse
                          (some #(when (inside dirless-walls dirless-corners y-walls y-corners %) %))
                          square)))
        (apply max)
        (println "Part 2:"))))
