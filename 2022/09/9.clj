(ns aoc.2022.09.9
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn move-head [[hx hy] dir]
  (case dir
    "U" [hx (dec hy)]
    "D" [hx (inc hy)]
    "L" [(dec hx) hy]
    "R" [(inc hx) hy]))

(defn move-tail [[hx hy] [tx ty]]
  (let [dx (- hx tx) dy (- hy ty)
        adx (abs dx) ady (abs dy)
        nx (cond (= 2 adx) (/ 2 dx)
                 (= 2 ady) dx
                 :else 0)
        ny (cond (= 2 ady) (/ 2 dy)
                 (= 2 adx) dy
                 :else 0)]
    [(+ tx nx) (+ ty ny)]))

(defn move [rope [dir dist]]
  (if (zero? dist)
    rope
    (let [[head & tails] rope
          new-head (move-head (peek head) dir)
          new-tails (->> tails
                         (reduce (fn [[prev tails] tail]
                                   (let [nt (move-tail prev (peek tail))]
                                     [nt (conj tails (conj tail nt))]))
                                 [new-head []])
                         peek)]
      (move (apply conj [(conj head new-head)] new-tails)
            [dir (dec dist)]))))

(defn solve [moves rope]
  (->> moves
       (reduce move rope)
       peek
       set
       count))

(let [moves (->> (read-input)
                 (map #(str/split % #" "))
                 (map (fn [[d i]] [d (parse-long i)])))]
  
  (println "Part 1:" (solve moves [[[0 0]] [[0 0]]]))
  (println "Part 2:" (solve moves (repeat 10 [[0 0]]))))