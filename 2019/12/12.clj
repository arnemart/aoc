(ns aoc.2019.12.12
  (:require [aoc.common :refer [read-input spy]]
            [clojure.edn :as edn]
            [clojure.string :as str]))

(defn gravity [moons]
  (->> moons
       (map (fn [moon]
              (let [{[x1 y1 z1] :p} moon]
                (update moon :v #(reduce (fn [[vx, vy, vz] {[x2 y2 z2] :p}]
                                           [(+ vx (compare x2 x1))
                                            (+ vy (compare y2 y1))
                                            (+ vz (compare z2 z1))]) % (disj moons moon))))))))
(defn velocity [moons]
  (->> moons
       (map (fn [moon]
              (let [{[px py pz] :p [vx vy vz] :v} moon]
                (assoc moon :p [(+ px vx) (+ py vy) (+ pz vz)]))))))

(defn step [moons] (velocity (gravity (set moons))))

(defn energy [moons]
  (->> moons
       (map (fn [{p :p v :v}]
              (* (apply + (map abs p)) (apply + (map abs v)))))
       (apply +)))

(defn -main []
  (let [moons (->> (read-input :test "<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>" :use-test false)
                   (map #(str/replace % #"[^\d -]" ""))
                   (map #(edn/read-string (str "[" % "]")))
                   (map-indexed (fn [i p] {:i i :p p :v [0 0 0]})))]

    (->> moons
         (iterate step)
         (take 1001)
         last
         energy
         (println "Part 1:"))

    (loop [state moons i 1]
      (when (= 0 (mod i 1000000))
        (println i))
      (let [next-state (sort-by :i (step state))]
        (if (= next-state moons)
          (println "Part 2:" i)
          (recur next-state (inc i)))))))
