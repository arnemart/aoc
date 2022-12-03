(ns aoc.2019.06.6
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]))

(defn depth
  ([planet orbits] (depth planet orbits 1))
  ([planet orbits d]
   (let [around (get orbits planet)]
     (if (= "COM" around)
       d
       (depth around orbits (+ d 1))))))

(defn santa-is-above [planet orbiting]
  (let [orbs (get orbiting planet)]
    (cond
      (empty? orbs) false
      (some #(= "SAN" %) orbs) true
      :else (some #(santa-is-above % orbiting) orbs))))

(defn go-up
  ([planet orbits orbiting] (go-up planet orbits orbiting 0))
  ([planet orbits orbiting i]
   (if (santa-is-above planet orbiting)
     [planet i]
     (go-up (get orbits planet) orbits orbiting (+ i 1)))))

(defn go-down
  ([planet orbiting] (go-down planet orbiting 0))
  ([planet orbiting i]
   (let [orbs (get orbiting planet)]
     (if (some #(= "SAN" %) orbs)
       i
       (go-down
        (first (filter #(santa-is-above % orbiting) orbs))
        orbiting
        (+ i 1))))))

(let [planet-list (->> (read-input)
                       (map #(str/split % #"\)")))
      orbits (->> planet-list
                  (map reverse)
                  (map vec)
                  (into {}))
      planets (keys orbits)
      orbiting (->> planets
                    (map (fn [p]
                           [p (->> planet-list
                                   (filter #(= p (first %)))
                                   (mapv last))]))
                    (into {}))
      [common-root distance-up] (go-up (get orbits "YOU") orbits orbiting)
      distance-down (go-down common-root orbiting)]

  (->> planets
       (map #(depth % orbits))
       sum
       (println "Part 1:"))

  (println "Part 2:" (+ distance-up distance-down)))
