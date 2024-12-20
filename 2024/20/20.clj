(ns aoc.2024.20.20 
  (:require
   [aoc.astar :refer [astar]]
   [aoc.common :refer [++ lines manhattan parse-input]]
   [blancas.kern.core :refer [many one-of*]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn get-start-end [maze]
  (->> (cartesian-product (range (count maze)) (range (count (first maze))))
       (reduce (fn [[s e] p]
                 (if (and s e) (reduced [s e])
                     (case (get-in maze p)
                       \S [p e]
                       \E [s p]
                       [s e])))
               [nil nil])))

(defn get-path [start end maze]
  (astar :start start
         :is-end (partial = end)
         :get-neighbors
         (fn [[y x]] (->> [[(inc y) x] [(dec y) x] [y (inc x)] [y (dec x)]]
                          (filter #(contains? #{\. \E} (get-in maze %)))))))

(defn cheats [honest-path visited honest-cost count-fn]
  (->> (range 1 (count honest-path))
       (mapcat (fn [i]
                 (let [path (take i honest-path)
                       current (last path)
                       cost-here (get-in visited [current :g])]
                   (count-fn current cost-here))))
       (map #(- honest-cost %))
       (filter #(>= % 100))
       count))

(let [maze (parse-input (lines (many (one-of* ".#SE"))))
      [start end] (get-start-end maze)
      {visited :visited honest-cost :cost path :path} (get-path start end maze)
      honest-path (reverse path)
      deltas (->> (cartesian-product (range -20 21) (range -20 21))
                  (map #(vector % (manhattan [0 0] %)))
                  (filter #(<= 2 (last %) 20)))]

  (println "Part 1:"
           (cheats honest-path visited honest-cost
                   (fn [current cost-here]
                     (->> [[2 0] [-2 0] [0 2] [0 -2]]
                          (map #(++ % current))
                          (filter #(contains? #{\. \E} (get-in maze %)))
                          (map #(get-in visited [% :g] honest-cost))
                          (filter #(> % cost-here))
                          (map #(+ 2 (- honest-cost (- % cost-here))))))))

  (println "Part 2:"
           (cheats honest-path visited honest-cost
                   (fn [current cost-here]
                     (->> deltas
                          (map (fn [[p c]] [(++ p current) c]))
                          (filter #(contains? #{\. \E} (get-in maze (first %))))
                          (map (fn [[p c]] [(get-in visited [p :g] honest-cost) c]))
                          (filter #(> (first %) cost-here))
                          (map #(+ (last %) (- honest-cost (- (first %) cost-here)))))))))
