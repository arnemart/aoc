(ns aoc.2024.15.15
  (:require
   [aoc.common :refer [++ parse-input]]
   [blancas.kern.core :refer [<*> << many many-till new-line* one-of* optional]]
   [clojure.math.combinatorics :refer [cartesian-product]]
   [medley.core :refer [find-first]]))

(def deltas {\^ [-1 0] \> [0 1] \v [1 0] \< [0 -1]})

(defn can-move [grid pos dir]
  (let [new-pos (++ pos (get deltas dir))
        v (get-in grid new-pos)]
    (case v
      \. true
      \# false
      \O (can-move grid new-pos dir)
      (\[ \]) (case dir
                (\< \>) (can-move grid new-pos dir)
                (\^ \v) (and (can-move grid new-pos dir)
                             (can-move grid (++ new-pos [0 (case v \[ 1 \] -1)]) dir))))))

(defn move [[grid pos] dir]
  (if (can-move grid pos dir)
    (let [new-pos (++ pos (get deltas dir))
          v (get-in grid pos)
          nv (get-in grid new-pos)]
      (if (= nv \#)
        [grid pos]
        (let [next-grid
              (case nv
                \. grid
                \O (first (move [grid new-pos] dir))
                (\[ \]) (-> (move [(case dir
                                     (\< \>) grid
                                     (\^ \v) (first (move [grid (++ new-pos [0 (case nv \[ 1 \] -1)])] dir)))
                                   new-pos] dir)
                            first))]
          [(-> next-grid
               (assoc-in new-pos v)
               (assoc-in pos \.))
           new-pos])))
    [grid pos]))

(defn gps [[grid]]
  (->> (cartesian-product (range (count grid)) (range (count (first grid))))
       (filter #(contains? #{\O \[} (get-in grid %)))
       (map (fn [[y x]] (+ x (* 100 y))))
       (apply +)))

(let [[grid moves] (parse-input (<*> (many-till (<< (many (one-of* "#.O@")) new-line*) new-line*)
                                     (many (<< (one-of* "^>v<") (optional new-line*)))))
      [y x] (->> (cartesian-product (range (count grid)) (range (count (first grid))))
                 (find-first #(= \@ (get-in grid %))))
      grid-2 (->> grid
                  (mapv (fn [row]
                          (->> row
                               (mapcat #(case %
                                          \O [\[ \]]
                                          \@ [\@ \.]
                                          [% %]))
                               vec))))]

  (->> moves
       (reduce move [grid [y x]])
       gps
       (println "Part 1:"))

  (->> moves
       (reduce move [grid-2 [y (* 2 x)]])
       gps
       (println "Part 2:")))
