(ns aoc.2023.10.10 
  (:require [aoc.common :refer [read-input]]
            [clojure.core.match :refer [match]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn find-next [pipes [y x] [py px]]
  (case (get-in pipes [y x])
    "|" [(+ y (- y py)) x]
    "-" [y (+ x (- x px))]
    "L" (if (= x px) [y (inc x)] [(dec y) x])
    "J" (if (= x px) [y (dec x)] [(dec y) x])
    "7" (if (= x px) [y (dec x)] [(inc y) x])
    "F" (if (= x px) [y (inc x)] [(inc y) x])))

(defn get-path [pipes start prev]
  (loop [path [start] cur start prev prev]
    (let [n (find-next pipes cur prev)]
      (if (= start n)
        path
        (recur (conj path n) n cur)))))

(defn enclosed? [pipes path [y x]]
  (let [str-to-the-left (->> path
                             (filter (fn [[py px]] (and (= y py) (< px x))))
                             sort
                             (map #(get-in pipes %))
                             str/join)]
    (->> str-to-the-left
         (re-seq #"\||F-*J|L-*7")
         count
         odd?)))
(time
 (let [pipes (->> (read-input)
                  (mapv #(str/split % #"")))
       [[sy sx]] (->> pipes
                      (keep-indexed (fn [y l]
                                      (let [[x] (keep-indexed #(when (= "S" %2) %1) l)]
                                        (when (some? x) [y x])))))
       [ny nx start-pipe] (match (mapv #(get-in pipes %)
                                       [[(dec sy) sx]
                                        [sy (inc sx)]
                                        [(inc sy) sx]
                                        [sy (dec sx)]])
                            [(:or "|" "F" "7") _ (:or "|" "L" "J") _] [(dec sy) sx "|"]
                            [_ (:or "-" "F" "L") _ (:or "-" "J" "7")] [sy (dec sx) "-"]
                            [(:or "|" "F" "7") (:or "-" "F" "L") _ _] [(dec sy) sx "L"]
                            [_ (:or "-" "F" "L") (:or "|" "L" "J") _] [sy (inc sx) "F"]
                            [_ _ (:or "|" "L" "J") (:or "-" "J" "7")] [sy (dec sx) "7"]
                            [(:or "|" "F" "7") _ _ (:or "-" "J" "7")] [(dec sy) sx "J"])

       pipes (assoc-in pipes [sy sx] start-pipe)
       path (get-path pipes [ny nx] [sy sx])
       path-set (set path)
       outside-path (->> (set (combo/cartesian-product
                               (range (count pipes))
                               (range (count (first pipes)))))
                         (filter #(not (contains? path-set %))))]

   (println "Part 1:" (/ (count path) 2))

   (->> outside-path
        (filter (partial enclosed? pipes path))
        count
        (println "Part 2:"))))