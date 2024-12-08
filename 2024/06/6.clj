(ns aoc.2024.06.6
  (:require
   [aoc.common :refer [++ parse-input points]]))

(def delta {\^ [-1 0] \> [0 1] \v [1 0] \< [0 -1]})
(def next-dir {\^ \> \> \v \v \< \< \^})

(defn step [lab w h [y x dir]]
  (let [[ny nx] (++ [y x] (get delta dir))]
    (cond (or (< ny 0) (< nx 0) (> ny h) (> nx w)) nil
          (get-in lab [ny nx]) (step lab w h [y x (get next-dir dir)])
          :else [ny nx dir])))

(defn loops? [w h guard lab]
  (loop [guard guard visited #{}]
    (cond
      (nil? guard) false
      (contains? visited guard) true
      :else (recur (step lab w h guard) (conj visited guard)))))

(let [{lab :lab guard :guard w :w h :h}
      (->> (parse-input points)
           (reduce (fn [d [v [y x]]]
                     (assoc
                      (cond (= \^ v) (assoc d :guard [y x v])
                            (= \# v) (assoc-in d [:lab y x] true)
                            :else d)
                      :w (max (:w d) y)
                      :h (max (:h d) x)))
                   {:lab {} :guard nil :w 0 :h 0}))
      path (->> (iterate (partial step lab w h) guard)
                (take-while some?)
                (map drop-last)
                set)]

  (println "Part 1:" (count path))

  (->> path
       (filter #(not= (drop-last guard) %))
       (map #(assoc-in lab % true))
       (filter (partial loops? w h guard))
       count
       (println "Part 2:")))