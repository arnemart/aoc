(ns aoc.2019.10.10
  (:require [aoc.common :refer [read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.math :as math]
            [clojure.string :as str]))

(defn count-visible-asteroids [asteroids [y x]]
  {:pos [y x]
   :visible (->> (disj asteroids [y x])
                 (map #(math/atan2 (- y (first %)) (- x (last %))))
                 set
                 count)})

(defn get-angles [[y x] asteroids]
  (->> (disj asteroids [y x])
       (map (fn [[ay ax]]
              {:pos [ay ax]
               :angle (math/atan2 (- ax x) (- ay y))
               :dist (+ (abs (- ay y)) (abs (- ax x)))}))
       set))

(defn vaporize-200 [asteroid-angles]
  (let [distinct-angles (->> asteroid-angles
                             (map :angle)
                             set)]
    (loop [seen-angles #{}
           i 1
           asts asteroid-angles]
      (let [candidates (->> asts
                            (filter #(not (contains? seen-angles (:angle %)))))
            max-angle (->> candidates
                           (map :angle)
                           (apply max))
            to-remove (->> asts
                           (filter #(not (contains? seen-angles (:angle %))))
                           (filter #(= (:angle %) max-angle))
                           (apply min-key :dist))]
        (if (= 200 i)
          (:pos to-remove)
          (recur (if (= (count seen-angles) (count distinct-angles))
                   #{}
                   (conj seen-angles (:angle to-remove)))
                 (inc i)
                 (disj asts to-remove)))))))

(defn -main []
  (let [field (->> (read-input)
                   (mapv #(str/split % #"")))
        asteroids (->> (combo/cartesian-product (range (count field)) (range (count (first field))))
                       (filter #(= "#" (get-in field %)))
                       set)
        most-visible (->> asteroids
                          (map (partial count-visible-asteroids asteroids))
                          (apply max-key :visible))
        asteroid-angles (get-angles (:pos most-visible) asteroids)
        twohundredth (vaporize-200 asteroid-angles)]

    (println "Part 1:" (:visible most-visible))

    (println "Part 2:" (+ (first twohundredth) (* 100 (last twohundredth))))))
