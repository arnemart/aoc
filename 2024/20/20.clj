(ns aoc.2024.20.20 
  (:require
   [aoc.astar :refer [astar]]
   [aoc.common :refer [++ lines manhattan parse-input]]
   [blancas.kern.core :refer [many one-of*]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(let [maze (parse-input (lines (many (one-of* ".#SE"))))
      [start end] (->> (cartesian-product (range (count maze)) (range (count (first maze))))
                       (reduce (fn [[s e] p]
                                 (if (and s e) (reduced [s e])
                                     (case (get-in maze p)
                                       \S [p e]
                                       \E [s p]
                                       [s e])))
                               [nil nil]))
      no-cheating (astar :start start
                         :is-end (partial = end)
                         :get-neighbors
                         (fn [[y x]] (->> [[(inc y) x] [(dec y) x] [y (inc x)] [y (dec x)]]
                                          (filter #(contains? #{\. \E} (get-in maze %))))))
      no-cheating-cost (:cost no-cheating)
      no-cheating-path (reverse (:path no-cheating))
      deltas (->> (cartesian-product (range -20 21) (range -20 21))
                  (map #(vector % (manhattan [0 0] %)))
                  (filter #(<= 2 (last %) 20)))]

  (->> (range 1 (count no-cheating-path))
       (mapcat (fn [i]
                 (let [path (take i no-cheating-path)
                       current (last path)
                       cost-here (get-in no-cheating [:visited current :g])]
                   (->> [[2 0] [-2 0] [0 2] [0 -2]]
                        (map #(++ % current))
                        (filter #(contains? #{\. \E} (get-in maze %)))
                        (map #(get-in no-cheating [:visited % :g] no-cheating-cost))
                        (filter #(> % cost-here))
                        (map #(+ 2 (- no-cheating-cost (- % cost-here))))))))
       (map #(- no-cheating-cost %))
       (filter #(>= % 100))
       count
       (println "Part 1:"))

  (->> (range 1 (count no-cheating-path))
       (mapcat (fn [i]
                 (let [path (take i no-cheating-path)
                       [cy cx] (last path)
                       cost-here (get-in no-cheating [:visited [cy cx] :g] no-cheating-cost)]
                   (->> deltas
                        (map (fn [[p c]] [(++ p [cy cx]) c]))
                        (filter (fn [[p]] (contains? #{\. \E} (get-in maze p))))
                        (map (fn [[p c]] [(get-in no-cheating [:visited p :g] no-cheating-cost) c]))
                        (filter #(> (first %) cost-here))
                        (map #(+ (last %) (- no-cheating-cost (- (first %) cost-here))))))))
       (map #(- no-cheating-cost %))
       (filter #(>= % 100))
       count
       (println "Part 2:")))
