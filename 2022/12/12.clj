(ns aoc.2022.12.12
  (:require [aoc.astar :refer [astar]]
            [aoc.common :refer [find-index read-input]]))

(defn adjacent [[y x]]
  [[(dec y) x]
   [(inc y) x]
   [y (dec x)]
   [y (inc x)]])

(defn neighbors-1 [hm p]
  (->> (adjacent p)
       (filter #(when-let [v (get-in hm %)]
                  (<= v (inc (get-in hm p)))))))

(defn neighbors-2 [hm p]
  (->> (adjacent p)
       (filter #(when-let [v (get-in hm %)]
                  (<= (dec (get-in hm p)) v)))))

(let [input (read-input)
      start-y (->> input (find-index #(re-matches #".*S.*" %2)))
      end-y   (->> input (find-index #(re-matches #".*E.*" %2)))
      start-x (->> (nth input start-y) (find-index #(= \S %2)))
      end-x   (->> (nth input end-y) (find-index #(= \E %2)))
      start [start-y start-x]
      end [end-y end-x]
      heightmap (-> (mapv #(mapv int %) input)
                    (assoc-in start (int \a))
                    (assoc-in end (int \z)))]

  (->> (astar :start start
              :is-end (partial = end)
              :get-neighbors (partial neighbors-1 heightmap)
              :heuristic #(- (int \z) (get-in heightmap %)))
       :cost
       (println "Part 1:"))

  (->> (astar :start end
              :is-end #(= (int \a) (get-in heightmap %))
              :get-neighbors (partial neighbors-2 heightmap)
              :heuristic #(- (get-in heightmap %) (int \a)))
       :cost
       (println "Part 2:")))