(ns aoc.2022.12.12
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [find-index manhattan read-input]]
            [clojure.math.combinatorics :as combo]))

(defn neighbors [hm [y x]]
  (->> [[(dec y) x]
        [(inc y) x]
        [y (dec x)]
        [y (inc x)]]
       (filter #(when-let [v (get-in hm %)]
                  (<= v (inc (get-in hm [y x])))))))

(let [input (read-input)
      start-y (->> input (find-index #(re-matches #".*S.*" %2)))
      end-y   (->> input (find-index #(re-matches #".*E.*" %2)))
      start-x (->> (nth input start-y) (find-index #(= \S %2)))
      end-x   (->> (nth input end-y) (find-index #(= \E %2)))
      heightmap (-> (mapv #(mapv int %) input)
                    (assoc-in [start-y start-x] (int \a))
                    (assoc-in [end-y end-x] (int \z)))
      all-low-points (->> (combo/cartesian-product (range (count heightmap)) (range (count (first heightmap))))
                          (filter #(= (int \a) (get-in heightmap %))))]

  (->> (astar :start [start-y start-x]
              :is-end #(= [end-y end-x] %)
              :get-neighbors (partial neighbors heightmap)
              :heuristic (partial manhattan [end-y end-x]))
       :cost
       (println "Part 1:"))

  (->> all-low-points
       (map (fn [p]
              (astar :start p
                     :is-end #(= [end-y end-x] %)
                     :get-neighbors (partial neighbors heightmap)
                     :heuristic (partial manhattan [end-y end-x]))))
       (filter some?)
       (map :cost)
       (apply min)
       (println "Part 2:")))