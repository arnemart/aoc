(ns aoc.2024.14.14 
  (:require
   [aoc.common :refer [dec-num- parse-input]]
   [blancas.kern.core :refer [many search]]) 
  (:import
   [java.awt Color]
   [java.awt.image BufferedImage]
   [java.io File]
   [javax.imageio ImageIO]))

(defn move-robot [[x y dx dy]]
  [(mod (+ x dx) 101) (mod (+ y dy) 103) dx dy])

(defn partition-robots [robots]
  (->> robots
       (filter (fn [[x y]] (and (not= x 50) (not= y 51))))
       (group-by (fn [[x y]] [(< x 50) (< y 51)]))
       (map (fn [[_ r]] (count r)))))

(defn draw [robots i]
  (let [w 202 h 206
        img (BufferedImage. w h BufferedImage/TYPE_INT_ARGB)]
    (doto (.getGraphics img)
      (.setColor Color/WHITE)
      (.fillRect 0 0 w h))
    (doseq [[x y] robots]
      (doto (.getGraphics img)
        (.setColor Color/GREEN)
        (.fillRect (* 2 x) (* 2 y) 2 2)))
    (ImageIO/write img "png" (File. (format "2024/14/img/%06d.png" i))))
  robots)

(let [robots (->> (parse-input (many (search dec-num-)))
                  (partition 4))]

  (loop [robots robots i 0]
    (when (= 100 i)
      (->> robots
           partition-robots
           (apply *)
           (println "Part 1:")))

    ;; (when (= 0 (mod (- i 23) 101))
    ;;   (draw robots i))

    (if (= 500 (->> robots
                    (map #(take 2 %))
                    set
                    count))
      (println "Part 2:" i)
      (recur (map move-robot robots) (inc i)))))