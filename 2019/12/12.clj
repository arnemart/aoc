(ns aoc.2019.12.12
  (:require [aoc.common :refer [read-input sum]]
            [clojure.edn :as edn]
            [clojure.math.numeric-tower :refer [lcm]]
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
              (* (sum (map abs p)) (sum (map abs v)))))
       sum))

(let [moons (->> (read-input)
                 (map #(str/replace % #"[^\d -]" ""))
                 (map #(edn/read-string (str "[" % "]")))
                 (map-indexed (fn [i p] {:i i :p p :v [0 0 0]})))]

  (->> moons
       (iterate step)
       (take 1001)
       last
       energy
       (println "Part 1:"))

  (loop [state moons seen {} seen-x #{} seen-y #{} seen-z #{} i 0]
    (let [next-state (sort-by :i (step state))
          xs (->> next-state (map (fn [{[px] :p [vx] :v}] [px vx])))
          ys (->> next-state (map (fn [{[_ py] :p [_ vy] :v}] [py vy])))
          zs (->> next-state (map (fn [{[_ _ pz] :p [_ _ vz] :v}] [pz vz])))
          seen (if (and (contains? seen-x xs) (nil? (:x seen))) (assoc seen :x i) seen)
          seen (if (and (contains? seen-y ys) (nil? (:y seen))) (assoc seen :y i) seen)
          seen (if (and (contains? seen-z zs) (nil? (:z seen))) (assoc seen :z i) seen)]
      (if (and (some? (:x seen)) (some? (:y seen)) (some? (:z seen)))
        (let [[x y z] (vals seen)]
          (println "Part 2:" (lcm x (lcm y z))))
        (recur next-state seen (conj seen-x xs) (conj seen-y ys) (conj seen-z zs) (inc i))))))
