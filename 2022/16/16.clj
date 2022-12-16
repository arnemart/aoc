(ns aoc.2022.16.16 
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]
            [clojure.math.combinatorics :as combo]))

(defn parse-valve [s]
  [(last (re-find #"Valve (..)" s))
   {:flow (parse-long (last (re-find #"rate=(\d+)" s)))
    :to (-> (re-find #"valves? (.+)$" s) last (str/split #", ") set)}])

(defn moves [valves max-flow]
  (memoize
   (fn [state]
     (let [next-state (update state :t + (:f state))
           loc (:l state)
           valve (get valves loc)
           can-open (and (not (contains? (:o state) loc))
                         (> (:flow valve) 0))]
       (if (= max-flow (:f state))
         [next-state]
         (concat (if can-open [(-> next-state (update :o conj loc) (update :f + (:flow valve)))] [])
                 (->> (:to valve)
                      (map #(assoc next-state :l %)))))))))

(defn moves-2 [valves max-flow]
  (memoize
   (fn [state]
     (let [next-state (update state :t + (:f state))
           l1 (:l state)
           l2 (:l2 state)
           v1 (get valves l1)
           v2 (get valves l2)
           can-open-1 (and (not (contains? (:o state) l1))
                           (> (:flow v1) 0))
           can-open-2 (and (not= l1 l2)
                           (not (contains? (:o state) l2))
                           (> (:flow v2) 0))]
       (if (= max-flow (:f state))
         [next-state]
         (concat (->> [(if can-open-1
                         (map #(-> next-state (update :o conj l1) (update :f + (:flow v1)) (assoc :l2 %)) (:to v2))
                         nil)
                       (if can-open-2
                         (map #(-> next-state (update :o conj l2) (update :f + (:flow v2)) (assoc :l %)) (:to v1))
                         nil)
                       (if (and can-open-1 can-open-2) (-> next-state (update :o conj l1 l2) (update :f + (:flow v1) (:flow v2))) nil)]
                      flatten
                      (filter some?))
                 (->> (combo/cartesian-product (:to v1) (:to v2))
                      (map (fn [[l1 l2]] (assoc next-state :l l1 :l2 l2))))))))))

(defn solve [j moves state]
  (loop [i 0 states #{state}]
    (if (= j i)
      (->> states
           (map :t)
           (apply max))
      (let [states (if (< i 6)
                     states
                     (let [max (/ (->> states (map :t) (apply max)) (+ 1 (/ 1.5 i)))]
                       (->> states (filter #(> (:t %) max)))))]
        (recur (inc i) (set (mapcat moves states)))))))

(let [valves (->> (read-input)
                  (map parse-valve)
                  (into {}))
      max-flow (->> valves
                    (map last)
                    (map :flow)
                    sum)
      initial-state {:f 0
                     :t 0
                     :o #{}
                     :l "AA"}
      initial-state-2 (assoc initial-state :l2 "AA")
      moves (moves valves max-flow)
      moves-2 (moves-2 valves max-flow)]

  (println "Part 1:" (solve 30 moves initial-state))
  (println "Part 2:" (solve 26 moves-2 initial-state-2)))