(ns aoc.2022.14.14 
  (:require [aoc.common :refer [inclusive-range read-input zip]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(import 'java.awt.image.BufferedImage 'javax.imageio.ImageIO 'java.awt.Color)
(defn draw-image [grid i]
  (let [img (BufferedImage. 200 360 BufferedImage/TYPE_INT_ARGB)]
    (doto (.getGraphics img)
      (.setColor Color/WHITE)
      (.fillRect 0 0 200 360))
    (doseq [[x y] grid]
      (doto (.getGraphics img)
        (.setColor Color/DARK_GRAY)
        (.fillRect (* 2 (- x 450)) (* 2 y) 2 2)))
    (ImageIO/write img "png" (File. (format "2022/14/img/%06d.png" i)))))

(defn add-sand [max-y grid]
  (loop [[x y] [500 0] new-grid grid]
    (let [new-pos (->> [[x (inc y)] [(dec x) (inc y)] [(inc x) (inc y)]]
                       (filter #(not (contains? grid %)))
                       first)]
      (cond
        (> y max-y) grid
        (nil? new-pos) new-grid
        :else (recur new-pos (conj grid new-pos))))))

(defn add-sand-until-full [max-y grid]
  (loop [grid grid i 1]
    (let [next-grid (add-sand max-y grid)]
      (if (= (count grid) (count next-grid))
        next-grid
        (do
          ;; (draw-image grid i)
          (recur next-grid (inc i)))))))

(let [paths (->> (read-input)
                 (map #(str/split % #" -> |,"))
                 (map #(map parse-long %))
                 (map #(partition 2 %)))
      max-y (->> paths
                 flatten
                 (keep-indexed #(when (odd? %1) %2))
                 (apply max))
      grid (->> paths
                (reduce #(->> (zip %2 (drop 1 %2))
                              (reduce (fn [g [[x1 y1] [x2 y2]]]
                                        (->> (combo/cartesian-product (inclusive-range x1 x2) (inclusive-range y1 y2))
                                             (reduce conj g))) %1)) #{}))
      grid-with-sand-part-1 (add-sand-until-full max-y grid)
      new-max-y (+ 2 max-y)
      grid-with-floor (->> (range 1000)
                           (reduce #(conj %1 [%2 new-max-y]) grid))
      grid-with-sand-part-2 (add-sand-until-full new-max-y grid-with-floor)]

  (println "Part 1:" (- (count grid-with-sand-part-1) (count grid)))
  (println "Part 2:" (inc (- (count grid-with-sand-part-2) (count grid-with-floor)))))