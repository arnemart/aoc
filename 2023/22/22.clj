(ns aoc.2023.22.22
  (:require [aoc.common :refer [inclusive-range read-input split-to-ints]]
            [clojure.math.combinatorics :as combo]))

(defn add-to-stack [stack brick]
  (reduce #(assoc-in %1 %2 brick) stack brick))

(defn remove-from-stack [stack brick]
  (reduce #(assoc-in %1 %2 nil) stack brick))

(defn down [[z y x]] [(dec z) y x])
(defn up [[z y x]] [(inc z) y x])

(defn bricks-near [where stack brick]
  (->> (map where brick)
       (keep #(get-in stack %))
       (filter #(not= brick %))
       set))

(def bricks-above (partial bricks-near up))
(def bricks-below (partial bricks-near down))

(defn lower-brick [[stack bricks] brick]
  (loop [brick brick]
    (let [next-brick (map down brick)
          z (first (first next-brick))]
      (if (or (= 0 z)
              (some #(get-in stack %) next-brick))
        [(add-to-stack stack brick) (conj bricks brick)]
        (recur next-brick)))))

(defn safe-to-zap [stack brick]
  (->> brick
       (bricks-above stack)
       (every? #(->> (bricks-below stack %)
                     count
                     (<= 2)))))

(defn unsupported [stack brick]
  (and (> (first (first brick)) 1)
       (= 0 (count (bricks-below stack brick)))))

(defn zap! [stack bricks]
  (loop [stack stack to-remove bricks removed 0]
    (let [stack (reduce remove-from-stack stack to-remove)
          supported (->> to-remove
                         (mapcat (partial bricks-above stack))
                         set
                         (filter (partial unsupported stack)))
          removed (+ removed (count supported))]
      (if (empty? supported)
        removed
        (recur stack supported removed)))))

(let [bricks (->> (read-input)
                  (map split-to-ints)
                  (map (fn [[x1 y1 z1 x2 y2 z2]]
                         (combo/cartesian-product (inclusive-range z1 z2)
                                                  (inclusive-range y1 y2)
                                                  (inclusive-range x1 x2))))
                  (sort #(compare (first (first %1)) (first (first %2)))))
      [stack bricks] (->> bricks
                          (reduce lower-brick [{} []]))]

  (->> bricks
       (filter (partial safe-to-zap stack))
       count
       (println "Part 1:"))

  (->> bricks
       (map #(zap! stack [%]))
       (apply +)
       (println "Part 2:")))