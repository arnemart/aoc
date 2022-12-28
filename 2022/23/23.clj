(ns aoc.2022.23.23 
  (:require [aoc.common :refer [count-where read-input tee zip]]
            [clojure.math.combinatorics :as combo]))

(def proposals (memoize (fn [i]
                          (->> [[[-1 -1] [-1 0] [-1 1]]
                                [[1 -1] [1 0] [1 1]]
                                [[-1 -1] [0 -1] [1 -1]]
                                [[-1 1] [0 1] [1 1]]]
                               cycle
                               (drop (mod i 4))
                               (take 4)))))

(defn propose [elves i]
  (->> elves
       (map (fn [[y x]]
              (let [free-sides (->> (proposals i)
                                    (map #(map (fn [[yd xd]] [(+ y yd) (+ x xd)]) %))
                                    (filter (fn [ps] (every? #(not (contains? elves %)) ps))))]

                [[y x] 
                 (if (contains? #{0 4} (count free-sides)) 
                   nil 
                   (nth (first free-sides) 1))])))))

(defn move [elves]
  (let [props (->> elves (map last) (filter some?))]
    (->> elves
         (map (fn [[l p]] 
                (if (and (some? p) (= 1 (count-where #(= p %) props))) p l)))
         set)))

(defn do-moves [elves times]
  (loop [i 0 elves elves]
    (if (= i times)
      elves
      (recur (inc i) (move (propose elves i))))))

(defn do-moves-forever [elves]
  (loop [i 0 elves elves]
    (let [next-elves (move (propose elves i))]
      (if (= elves next-elves)
        (inc i)
        (recur (inc i) next-elves)))))

(let [grove (read-input)
      elves (->> (combo/cartesian-product (range (count grove)) (range (count (first grove))))
                 (filter #(= \# (get-in grove %)))
                 set)
      moved-elves (do-moves elves 10)
      [[min-y min-x] [max-y max-x]] (->> moved-elves
                                         (apply zip)
                                         (tee [#(map (fn [v] (apply min v)) %)
                                               #(map (fn [v] (apply max v)) %)]))]

  (println "Part 1:" (- (* (inc (- max-y min-y)) (inc (- max-x min-x))) (count elves)))
  (println "Part 2:" (do-moves-forever elves)))