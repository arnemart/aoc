(ns aoc.2024.18.18 
  (:require
   [aoc.astar :refer [astar]]
   [aoc.common :refer [++ binsearch lines manhattan nums parse-input]]
   [clojure.string :as str]))

(defn neighbors [memory p]
  (->> [[1 0] [-1 0] [0 1] [0 -1]]
       (map #(++ p %))
       (filter #(= \. (get-in memory %)))))

(def empty-memory (mapv vec (repeat 71 (repeat 71 \.))))

(defn get-path [bytes]
  (let [mem (reduce #(assoc-in %1 (reverse %2) \#) empty-memory bytes)]
    (:cost (astar :start [0 0]
                  :is-end #(= [70 70] %)
                  :get-neighbors (partial neighbors mem)
                  :heuristic #(manhattan % [70 70])))))

(let [bytes (parse-input (lines nums))]

  (->> (get-path (take 1024 bytes))
       (println "Part 1:"))
  
  (->> (binsearch #(get-path (take % bytes)) 1025 (count bytes))
       (nth bytes)
       (str/join ",")
       (println "Part 2:")))