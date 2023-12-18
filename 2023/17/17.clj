(ns aoc.2023.17.17
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [manhattan read-input]]
            [clojure.string :as str]))

(defn neighbors [[end-y end-x] [y x dir dist]]
  (->> [[(dec y) x :u (if (= dir :u) (inc dist) 1)]
        [(inc y) x :d (if (= dir :d) (inc dist) 1)]
        [y (dec x) :l (if (= dir :l) (inc dist) 1)]
        [y (inc x) :r (if (= dir :r) (inc dist) 1)]]
       (filter (fn [[y x]]
                 (and (<= 0 y end-y)
                      (<= 0 x end-x))))
       (filter (fn [[_ _ d]]
                 (and (not (and (= :u dir) (= :d d)))
                      (not (and (= :d dir) (= :u d)))
                      (not (and (= :l dir) (= :r d)))
                      (not (and (= :r dir) (= :l d))))))))

(defn validate-path-1 [path]
  (< (last (first path)) 4))

(defn validate-path-2 [path]
  (let [cur-dist (last (first path))]
    (or (<= 4 cur-dist 10)
        (and
         (< cur-dist 4)
         (or (< (count path) (inc cur-dist))
             (>= (last (nth path cur-dist)) 4))))))

(let [grid (->> (read-input)
                (map #(str/split % #""))
                (mapv #(mapv parse-long %)))
      end [(dec (count grid)) (dec (count (first grid)))]]

  (->> (astar :start [0 0 nil 1]
              :is-end (fn [[y x]] (= end [y x]))
              :calculate-cost (fn [_ [y x]] (get-in grid [y x]))
              :heuristic (partial manhattan end)
              :get-neighbors (partial neighbors end)
              :validate-path validate-path-1)
       :cost
       (println "Part 1:"))

  (->> [[0 0 :r 1] [0 0 :d 1]]
       (map #(astar :start %
                    :is-end (fn [[y x _ dist]]
                              (and (= end [y x])
                                   (>= dist 4)))
                    :calculate-cost (fn [_ [y x]] (get-in grid [y x]))
                    :heuristic (partial manhattan end)
                    :get-neighbors (partial neighbors end)
                    :validate-path validate-path-2))
       (map :cost)
       (apply min)
       (println "Part 2:")))