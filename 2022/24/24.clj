(ns aoc.2022.24.24
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [manhattan read-input]]
            [clojure.math.combinatorics :as combo]))

(def deltas {\> [0 1] \v [1 0] \< [0 -1] \^ [-1 0]})

(defn blizz [h w blizzards]
  (->> blizzards
       (map (fn [[y x dir]]
              (let [[yd xd] (get deltas dir)]
                [(mod (+ y yd) h) (mod (+ x xd) w) dir])))))

(def blizz-minute (memoize (fn [h w blizzards minute]
                             (if (zero? minute)
                               blizzards
                               (recur h w (blizz h w blizzards) (dec minute))))))

(def blizz-pos (memoize (fn [blizzards]
                          (->> blizzards
                               (map butlast)
                               set))))

(defn neighbors [h w blizzards [y x m]]
  (let [nm (inc m)
        b (blizz-pos (blizz-minute h w blizzards nm))]
    (->> [[y x nm]
          [(inc y) x nm]
          [y (inc x) nm]
          [(dec y) x nm]
          [y (dec x) nm]]
         (filter (fn [[ny nx]]
                   (and (<= (if (= 0 x) -1 0) ny (if (= nx (dec w)) h (dec h)))
                        (<= 0 nx (dec w))
                        (not (contains? b [ny nx]))))))))

(let [valley (->> (read-input)
                  (drop 1)
                  butlast
                  (mapv #(subs % 1 (dec (count %)))))
      blizzards (->> (combo/cartesian-product (range (count valley)) (range (count (first valley))))
                     (filter #(not= (get-in valley %) \.))
                     (map (fn [[y x]] [y x (get-in valley [y x])])))
      h (count valley)
      w (count (first valley))
      start [-1 0]
      end [h (dec w)]
      part1 (:cost (astar :start (conj start 0)
                          :is-end (fn [[y x]] (= [y x] end))
                          :heuristic (partial manhattan end)
                          :get-neighbors (partial neighbors h w blizzards)))
      part2-1 (+ part1
                 (:cost (astar :start (conj end part1)
                               :is-end (fn [[y x]] (= [y x] start))
                               :heuristic (partial manhattan [-1 0])
                               :get-neighbors (partial neighbors h w blizzards))))
      part2-2 (+ part2-1
                 (:cost (astar :start (conj start part2-1)
                               :is-end (fn [[y x]] (= [y x] end))
                               :heuristic (partial manhattan end)
                               :get-neighbors (partial neighbors h w blizzards))))]
  (println "Part 1:" part1)
  (println "Part 2:" part2-2))