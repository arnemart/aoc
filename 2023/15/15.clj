(ns aoc.2023.15.15
  (:require [aoc.common :refer [read-input]]
            [flatland.ordered.map :refer [ordered-map]]))

(defn HASH [s]
  (reduce #(mod (* (+ %1 (int %2)) 17) 256) 0 s))

(defn HASMAP [boxes step]
  (let [[_ label op lens] (re-find #"(\w+)([=-])(\d+)?" step)
        box (HASH label)]
    (case op
      "-" (update boxes box dissoc label)
      "=" (update boxes box assoc label (parse-long lens)))))

(let [steps (read-input :split-with #",")]

  (->> steps
       (map HASH)
       (apply +)
       (println "Part 1:"))

  (->> steps
       (reduce HASMAP (vec (repeat 256 (ordered-map))))
       (reduce-kv #(+ %1 (->> %3
                              (map-indexed (fn [li [_ lens]]
                                             (* (inc %2) (inc li) lens)))
                              (apply +)))
                  0)
       (println "Part 2:")))