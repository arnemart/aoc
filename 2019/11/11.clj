(ns aoc.2019.11.11
  (:require [aoc.2019.intcode :refer [run]]
            [aoc.common :refer [read-input]]
            [clojure.core.async :refer [<! <!! >! >!! chan close! go go-loop]]
            [clojure.string :as str]))

(def delta-x {:u 0 :r 1 :d 0 :l -1})
(def delta-y {:u -1 :r 0 :d 1 :l 0})

(defn turn [current t]
  (let [dirs [:u :r :d :l]]
    (nth dirs (mod (+ (if (= 0 t) -1 1) (.indexOf dirs current)) 4))))

(defn step [state color t]
  (let [next-dir (turn (:dir state) t)]
    (-> state
        (assoc-in [:painted [(:x state) (:y state)]] color)
        (assoc
         :dir next-dir
         :x (+ (:x state) (get delta-x next-dir))
         :y (+ (:y state) (get delta-y next-dir))))))

(defn run-program [start-color program]
  (let [in-chan (chan) out-chan (chan)]
    (go (run in-chan out-chan program #(close! out-chan)))
    (>!! in-chan start-color)
    (<!!
     (go-loop [state {:x 0 :y 0 :dir :u :painted {}}]
       (if-let [color (<! out-chan)]
         (let [t (<! out-chan)
               next-state (step state color t)]
           (go (>! in-chan (get-in next-state [:painted [(:x next-state) (:y next-state)]] 0)))
           (recur next-state))
         (:painted state))))))

(let [program (->> (read-input :split-with #",")
                   (map parse-long))
      coords-part2 (->> program
                        (run-program 1)
                        (filter #(= 1 (last %)))
                        keys
                        set)
      max-x (->> coords-part2 (map first) (apply max) inc)
      max-y (->> coords-part2 (map last) (apply max) inc)]

  (->> program
       (run-program 0)
       count
       (println "Part 1:"))

  (println "Part 2:")
  (->> (range max-y)
       (map (fn [y]
              (->> (range max-x)
                   (map #(if (contains? coords-part2 [% y]) "#" " "))
                   (str/join))))
       (str/join "\n")
       println))