(ns aoc.2023.22.22
  (:require [aoc.common :refer [inclusive-range read-input split-to-ints]]
            [clojure.math.combinatorics :as combo]))

(defn add-to-stack [stack brick]
  (->> brick
       (reduce #(assoc-in %1 %2 brick) stack)))

(defn down [[z y x]] [(dec z) y x])
(defn up [[z y x]] [(inc z) y x])

(defn lower-brick [[stack bricks] brick]
  (loop [brick brick]
    (let [next-brick (map down brick)
          z (first (first next-brick))]
      (if (or (= 0 z)
              (some #(get-in stack %) next-brick))
        [(add-to-stack stack brick) (conj bricks brick)]
        (recur next-brick)))))

(defn bricks-above [stack brick]
  (->> (map up brick)
       (keep #(get-in stack %))
       (filter #(not= brick %))
       set))

(defn bricks-below [stack brick]
  (->> (map down brick)
       (keep #(get-in stack %))
       (filter #(not= brick %))
       set))

(defn supported-only-by [stack brick]
  (->> brick
       (bricks-above stack)
       (filter #(->> %
                     (bricks-below stack)
                     count
                     (>= 1)))
       set))

(defn can-be-disintegrated [stack brick]
  (= 0 (count (supported-only-by stack brick))))

(defn remove-from-stack [stack brick]
  (->> brick
       (reduce #(assoc-in %1 %2 nil) stack)))

(defn unsupported [stack brick]
  (and (> (first (first brick)) 1)
       (= 0 (count (bricks-below stack brick)))))

(defn remove-unsupported [initial-stack initial-bricks brick]
  (loop [stack (remove-from-stack initial-stack brick) bricks (set initial-bricks)]
    (let [[next-stack next-bricks]
          (reduce (fn [[s bs] b]
                    (if (unsupported s b)
                      [(remove-from-stack s b) (disj bs b)]
                      [s bs])) [stack bricks] bricks)]
      (if (= stack next-stack)
        (- (count initial-bricks) (count bricks))
        (recur next-stack next-bricks)))))

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
       (filter (partial can-be-disintegrated stack))
       count
       (println "Part 1:"))

  (->> bricks
       (map (partial remove-unsupported stack bricks))
       (apply +)
       (println "Part 2:")))