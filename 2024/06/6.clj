(ns aoc.2024.06.6
  (:require
   [aoc.common :refer [group-pairs lines parse-input]]
   [blancas.kern.core :refer [<|> bind get-position many return sym*]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(def dirs {\^ [-1 0] \> [0 1] \v [1 0] \< [0 -1]})
(def next-dir {\^ \> \> \v \v \< \< \^})

(defn step [lab w h [y x dir]]
  (let [[dy dx] (get dirs dir)
        ny (+ y dy)
        nx (+ x dx)]
    (cond (or (< ny 0) (< nx 0) (> ny h) (> nx w)) nil
          (get-in lab [ny nx]) (step lab w h [y x (get next-dir dir)])
          :else [ny nx dir])))

(defn loops? [w h guard lab]
  (let [step (partial step lab w h)]
    (loop [guard guard visited #{}]
      (let [next-guard (step guard)]
        (cond
          (nil? next-guard) false
          (contains? visited next-guard) true
          :else (recur next-guard (conj visited next-guard)))))))

(let [items (->> (parse-input
                  (lines (many (bind [s (<|> (sym* \.) (sym* \#) (sym* \^))
                                      p get-position]
                                     (return (cond
                                               (= s \#) [(dec (:line p)) (- (:col p) 2)]
                                               (= s \^) [(dec (:line p)) (- (:col p) 2) s]
                                               :else nil))))))
                 (apply concat)
                 (filter some?))
      guard (->> items
                 (filter #(= 3 (count %)))
                 first)
      lab (->> items
               (filter #(= 2 (count %)))
               group-pairs)
      w (->> items (map #(nth % 1)) (apply max))
      h (->> items (map first) (apply max))]

  (->> (iterate (partial step lab w h) guard)
       (take-while some?)
       (map drop-last)
       set
       count
       (println "Part 1:"))

  (->> (cartesian-product (range (inc h)) (range (inc w)))
       (filter #(not (get-in lab %)))
       (map (fn [[y x]] (assoc-in lab [y x] true)))
       (filter (partial loops? w h guard))
       count
       (println "Part 2:")))