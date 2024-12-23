(ns aoc.2024.16.16
  (:require
   [aoc.astar :refer [astar]]
   [aoc.common :refer [lines manhattan parse-input]]
   [blancas.kern.core :refer [many one-of*]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn get-path [maze start is-end]
  (astar :start start
         :is-end is-end
         :get-neighbors (fn [[y x]]
                          (->> [[(inc y) x \v] [(dec y) x \^] [y (inc x) \>] [y (dec x) \<]]
                               (filter (fn [[y x]] (contains? #{\. \E} (get-in maze [y x]))))))
         :calculate-cost (fn [[_ _ d1] [_ _ d2]]
                           (if (= d1 d2) 1 1001))))

(let [maze (parse-input (lines (many (one-of* "#.SE"))))
      [[sy sx] end] (->> (cartesian-product (range (count maze)) (range (count (first maze))))
                         (reduce (fn [[s e] p]
                                   (if (and s e) (reduced [s e])
                                       (case (get-in maze p)
                                         \S [p e]
                                         \E [s p]
                                         [s e])))
                                 [nil nil]))

      shortest-path (:cost (get-path maze [sy sx \>] #(= end (drop-last %))))]

  (println "Part 1:" shortest-path)

  (->> (cartesian-product (range (count maze)) (range (count (first maze))))
       (filter #(= \. (get-in maze %)))
       (pmap (fn [[y x]]
               (->> [\> \^ \< \v]
                    (some (fn [d]
                            (let [from-start (get-path maze [sy sx \>] #(= [y x d] %))
                                  h (manhattan [y x] end)]
                              (if (and (some? from-start)
                                       (<= (+ h (:cost from-start)) shortest-path))
                                (let [to-end (get-path maze (first (:path from-start)) #(= end (drop-last %)))]
                                  (if to-end
                                    (= shortest-path (+ (:cost from-start) (:cost to-end)))
                                    false))
                                false)))))))
       (filter true?)
       count
       (+ 2)
       (println "Part 2:")))