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

(defn cheats [maze {visited :visited honest-cost :cost path :path} deltas]
  (let [honest-path (reverse path)]
    (->> (range 1 (count honest-path))
         (mapcat (fn [i]
                   (let [path (take i honest-path)
                         current (last path)
                         cost-here (get-in visited [current :g])]
                     (->> deltas
                          (map (fn [[p c]] [(++ p current) c]))
                          (filter #(contains? #{\. \E} (get-in maze (first %))))
                          (map (fn [[p c]] [(get-in visited [p :g] honest-cost) c]))
                          (filter #(> (first %) cost-here))
                          (map #(+ (last %) (- honest-cost (- (first %) cost-here))))))))
         (map #(- honest-cost %))
         (filter #(>= % 100))
         count)))

(let [maze (parse-input (lines (many (one-of* ".#SE"))))
      [start end] (get-start-end maze)
      honest-attempt (get-path start end maze)]

  (println "Part 1:" (cheats maze honest-attempt
                             [[[2 0] 2] [[-2 0] 2] [[0 2] 2] [[0 -2] 2]]))

  (println "Part 2:" (cheats maze honest-attempt
                             (->> (cartesian-product (range -20 21) (range -20 21))
                                  (map #(vector % (manhattan [0 0] %)))
                                  (filter #(<= 2 (last %) 20))))))
