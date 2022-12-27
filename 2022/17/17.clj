(ns aoc.2022.17.17 
  (:require [aoc.common :refer [read-input sum zip]]
            [clojure.math.combinatorics :as combo]))

(def rocks [[[1 1 1 1]]
            [[0 1 0]
             [1 1 1]
             [0 1 0]]
            [[0 0 1]
             [0 0 1]
             [1 1 1]]
            [[1]
             [1]
             [1]
             [1]]
            [[1 1]
             [1 1]]])

(def rock-coords
  (memoize (fn [rock]
             (->> (combo/cartesian-product (range (count rock)) (range (count (first rock))))
                  (filter #(= 1 (get-in rock %)))))))

(defn can-move [rock y x yd xd grid]
  (->> (rock-coords rock)
       (map (fn [[ry rx]] [(+ ry y yd) (+ rx x xd)]))
       (every? #(= 0 (get-in grid %)))))

(defn overlay-rock [rock y x grid]
  (->> (rock-coords rock)
       (map (fn [[ry rx]] [(+ y ry) (+ x rx)]))
       (reduce #(assoc-in %1 %2 1) grid)))

(defn add-space-for-rock [rock grid]
  (-> (take (+ 3 (count rock)) (repeat [0 0 0 0 0 0 0]))
      (concat grid)
      vec))

(defn add-rock [rock grid dirs]
  (let [grid (add-space-for-rock rock grid)]
    (loop [i 0 y 0 x 2 dirs dirs]
      (if (even? i)
        (let [dx (first dirs)
              new-x (if (can-move rock y x 0 dx grid) (+ x dx) x)]
          (if (can-move rock y new-x 1 0 grid)
            (recur (inc i) y new-x (rest dirs))
            [(overlay-rock rock y new-x grid) (rest dirs)]))
        (let [new-y (if (can-move rock y x 1 0 grid) (inc y) y)]
          (recur (inc i) new-y x dirs))))))

(defn trim-grid [grid]
  (vec (drop-while #(= [0 0 0 0 0 0 0] %) grid)))

(defn height [num dirs rocks]
  (loop [i 0 grid [] dirs (cycle dirs) rocks (cycle rocks) heights [0]]
    (if (= i num)
      heights
      (let [[grid dirs] (add-rock (first rocks) grid dirs)
            grid (trim-grid grid)]
        (recur (inc i) grid dirs (rest rocks) (conj heights (count grid)))))))

(defn find-cycle [l]
  (->> (range 10 (inc (quot (count l) 2)))
       (some #(when (= (take % (drop % l)) (take % l)) %))))

(let [dirs (->> (read-input :split-with #"")
                (map #(get {"<" -1 ">" 1} %)))
      heights (height 5000 dirs rocks)
      deltas (->> (zip heights (drop 1 heights))
                  (map (fn [[a b]] (- b a))))
      [offset cycle] (some #(let [cyc (find-cycle (drop % deltas))] (when (some? cyc) [% cyc])) (range))]

  (println "Part 1:" (nth heights 2022))
  (println "Part 2:" (+ (sum (take offset deltas)) 
                        (* (sum (take cycle (drop offset deltas))) (quot 1000000000000 cycle))
                        (sum (take (- (mod 1000000000000 cycle) 80) (drop offset deltas))))))