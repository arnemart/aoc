(ns aoc.2023.16.16
  (:require [aoc.common :refer [read-input]]
            [clojure.core.match :refer [match]]
            [clojure.set :as set]))

(defn move [y x dir]
  (case dir
    :u [dir (dec y) x]
    :d [dir (inc y) x]
    :l [dir y (dec x)]
    :r [dir y (inc x)]))

(defn move-beam [grid [dir y x]]
  (let [move (partial move y x)]
    (->>
     (match [dir (get-in grid [y x])]
       [_ nil] []
       [_ \.] [(move dir)]
       [(:or :r :l) \-] [(move dir)]
       [(:or :u :d) \|] [(move dir)]
       [:l \\] [(move :u)]
       [:r \/] [(move :u)]
       [:r \\] [(move :d)]
       [:l \/] [(move :d)]
       [:u \\] [(move :l)]
       [:d \/] [(move :l)]
       [:d \\] [(move :r)]
       [:u \/] [(move :r)]
       [(:or :r :l) \|] [(move :u) (move :d)]
       [(:or :u :d) \-] [(move :l) (move :r)])
     (filter (fn [[_ y x]]
               (and (<= 0 y (dec (count grid)))
                    (<= 0 x (dec (count (first grid))))))))))

(defn step [move-beam pos]
  (set (mapcat move-beam pos)))

(defn bounce [step start]
  (loop [pos [start] seen #{start} i 0]
    (let [next-pos (set/difference (step pos) seen)
          next-seen (set/union seen next-pos)]
      (if (= (count seen) (count next-seen))
        (->> seen
             (map #(drop 1 %))
             set
             count)
        (recur next-pos next-seen (inc i))))))

(let [grid (->> (read-input)
                (mapv vec))
      end-vertical (dec (count grid))
      end-horizontal (dec (count (first grid)))
      vertical (->> (range (count grid))
                    (mapcat (fn [i] [[:r i 0] [:l i end-vertical]])))
      horizontal (->> (range (count (first grid)))
                      (mapcat (fn [i] [[:d 0 i] [:u end-horizontal i]])))
      move-beam (memoize (partial move-beam grid))
      step (memoize (partial step move-beam))
      all-bounces (->> (concat vertical horizontal)
                       (map (partial bounce step)))]

  (println "Part 1:" (first all-bounces))
  (println "Part 2:" (apply max all-bounces)))