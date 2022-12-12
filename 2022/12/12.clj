(ns aoc.2022.12.12
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn neighbors [hm [y x]]
  (->> [[(dec y) x]
        [(inc y) x]
        [y (dec x)]
        [y (inc x)]]
       (filter (fn [[ny nx]]
                 (and (>= ny 0)
                      (>= nx 0)
                      (< ny (count hm))
                      (< nx (count (first hm)))
                      (<= (get-in hm [ny nx]) (inc (get-in hm [y x]))))))))

(let [input (read-input)
      start-y (->> input (keep-indexed #(when (re-matches #".*S.*" %2) %1)) first)
      end-y (->> input (keep-indexed #(when (re-matches #".*E.*" %2) %1)) first)
      start-x (as-> input v (nth v start-y) (str/split v #"") (keep-indexed #(when (= "S" %2) %1) v) (first v))
      end-x (as-> input v (nth v start-y) (str/split v #"") (keep-indexed #(when (= "E" %2) %1) v) (first v))
      heightmap (as-> input v
                  (mapv #(mapv int %) v)
                  (assoc-in v [start-y start-x] (int \a))
                  (assoc-in v [end-y end-x] (int \z)))
      all-low-points (->> (combo/cartesian-product (range (count heightmap)) (range (count (first heightmap))))
                          (filter #(= (int \a) (get-in heightmap %))))]


  (->> (astar :start [start-y start-x]
              :is-end #(= [end-y end-x] %)
              :get-neighbors (partial neighbors heightmap)
              :heuristic (fn [[y x]] (+ (abs (- y end-y)) (abs (- x end-x)))))
       :cost
       (println "Part 1:"))

  (->> all-low-points
       (map (fn [p]
              (astar :start p
                     :is-end #(= [end-y end-x] %)
                     :get-neighbors (partial neighbors heightmap)
                     :heuristic (fn [[y x]] (+ (abs (- y end-y)) (abs (- x end-x)))))))
       (filter some?)
       (map :cost)
       (apply min)
       (println "Part 2:")))