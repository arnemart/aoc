(ns aoc.2023.10.10 
  (:require [aoc.common :refer [read-input]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn find-next [pipes [y x] [py px]]
  (case (get-in pipes [y x])
    "|" (if (> y py) [(inc y) x] [(dec y) x])
    "-" (if (> x px) [y (inc x)] [y (dec x)])
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
                             str/join)
        massaged-str (-> str-to-the-left
                         (str/replace #"L-*J" "")
                         (str/replace #"F-*7" "")
                         (str/replace #"F-*J" "|")
                         (str/replace #"L-*7" "|"))]
    (->> massaged-str
         (filter #(= \| %))
         count
         odd?)))

(let [pipes (->> (read-input)
                 (mapv #(str/split % #"")))
      [[sy sx]] (->> pipes
                     (keep-indexed (fn [y l]
                                     (let [[x] (keep-indexed #(when (= "S" %2) %1) l)]
                                       (when (some? x) [y x])))))
      [ny nx] [(dec sy) sx]
      pipes (assoc-in pipes [sy sx] "|")
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
       (println "Part 2:")))