(ns aoc.2019.03.3
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]
            [clojure.set :as set]))

(defn draw [{:keys [s pos steps]} [dir dist]]
  (let [[x y] pos]
    (if (= 0 dist)
      {:s s :pos pos :steps steps}
      (draw {:s (-> s
                    (assoc-in [[x y] :dist] (+ (abs x) (abs y)))
                    (update-in [[x y] :steps] #(if (nil? %) steps (min steps %))))
             :steps (+ 1 steps)
             :pos (case dir
                    "U" [x (- y 1)]
                    "D" [x (+ y 1)]
                    "L" [(- x 1) y]
                    "R" [(+ x 1) y])}
            [dir (- dist 1)]))))

(defn -main []
  (let [[w1 w2]
        (->> (read-input)
             (map #(->>
                    (str/split % #",")
                    (map (fn [s] [(subs s 0 1) (parse-long (subs s 1))]))))
             (map #(->> % (reduce draw {:s {} :pos [0 0] :steps 0}) :s)))
        overlaps (-> (set (keys w1))
                     (set/intersection (set (keys w2)))
                     (disj [0 0]))]

    (->> overlaps
         (map #(get-in w1 [% :dist]))
         (apply min)
         (println "Part 1:"))

    (->> overlaps
         (map #(+ (get-in w1 [% :steps]) (get-in w2 [% :steps])))
         (apply min)
         (println "Part 2:"))))