(ns aoc.2023.14.14
  (:require [aoc.common :refer [read-input zip]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn find-rocks [grid]
  (->> (combo/cartesian-product (range (count grid)) (range (count (first grid))))
       (filter #(= "O" (get-in grid %)))))

(defn move-rock [grid [y x]]
  (let [grid (assoc-in grid [y x] ".")]
    (loop [y y]
      (if (not= "." (get-in grid [(dec y) x]))
        (assoc-in grid [y x] "O")
        (recur (dec y))))))

(defn tilt [grid]
  (let [rocks (find-rocks grid)]
    (->> rocks
         (reduce move-rock grid))))

(defn calculate-load [grid]
  (->> grid
       (map-indexed (fn [i r]
                      (->> r
                           (filter #(= "O" %))
                           count
                           (* (- (count grid) i)))))
       (apply +)))

(defn rotate [grid]
  (->> grid
       (apply zip)
       (map reverse)
       (mapv vec)))

(defn run-cycle [grid]
  (nth (iterate (comp rotate tilt) grid) 4))

(defn run-some-cycles [grid]
  (->> (iterate run-cycle grid)
       (take 400)
       (map calculate-load)
       vec))

(defn find-pattern [l]
  (->> (range 10 (inc (quot (count l) 2)))
       (some #(when (= (take % (drop % l)) 
                       (take % l)) 
                %))))

(defn offset-and-pattern [l]
  (some #(when-some [pat (find-pattern (drop % l))]
           [% pat])
        (range)))

(let [grid (->> (read-input)
                (mapv #(str/split % #"")))
      loads-2 (run-some-cycles grid)
      [offset length] (offset-and-pattern loads-2)]

  (->> (tilt grid)
       calculate-load
       (println "Part 1:")) 

  (println "Part 2:" (nth loads-2 
                          (+ offset (mod (- 1000000000 offset) length)))))