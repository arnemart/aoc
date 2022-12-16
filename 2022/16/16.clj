(ns aoc.2022.16.16 
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]
            [clojure.math.combinatorics :as combo]))

(defn parse-valve [s]
  [(last (re-find #"Valve (..)" s))
   {:flow (parse-long (last (re-find #"rate=(\d+)" s)))
    :to (-> (re-find #"valves? (.+)$" s) last (str/split #", ") set)}])

(defn moves [valves max-flow state]
  (let [next-state (update state :total-flown + (:flow state))
        loc (:you state)
        valve (get valves loc)
        can-open (and (not (contains? (:open state) loc))
                      (> (:flow valve) 0))]
    (if (= max-flow (:flow next-state))
      [next-state]
      (concat (if can-open [(-> next-state (update :open conj loc) (update :flow + (:flow valve)))] [])
              (->> (:to valve)
                   (map #(assoc next-state :you %)))))))

(defn moves-2 [valves max-flow state]
  (let [next-state (update state :total-flown + (:flow state))
        l1 (:you state)
        l2 (:elephant state)
        v1 (get valves l1)
        v2 (get valves l2)
        can-open-1 (and (not (contains? (:open state) l1))
                        (> (:flow v1) 0))
        can-open-2 (and (not= l1 l2)
                        (not (contains? (:open state) l2))
                        (> (:flow v2) 0))]
    (if (= max-flow (:flow next-state))
      [next-state]
      (concat (->> [(when can-open-1
                      (map #(-> next-state (update :open conj l1) (update :flow + (:flow v1)) (assoc :elephant %)) (:to v2)))
                    (when can-open-2
                      (map #(-> next-state (update :open conj l2) (update :flow + (:flow v2)) (assoc :you %)) (:to v1)))
                    (when (and can-open-1 can-open-2)
                      (-> next-state (update :open conj l1 l2) (update :flow + (:flow v1) (:flow v2))))]
                   flatten
                   (filter some?))
              (->> (combo/cartesian-product (:to v1) (:to v2))
                   (map (fn [[l1 l2]] (assoc next-state :you l1 :elephant l2))))))))

(defn solve [j moves state]
  (loop [i 0 states #{state}]
    (if (= j i)
      (->> states
           (map :total-flown)
           (apply max))
      (let [states (if (< i 5)
                     states
                     (let [max (/ (->> states (map :total-flown) (apply max)) (+ 1 (/ 1.2 i)))]
                       (->> states (filter #(> (:total-flown %) max)))))]
        (recur (inc i) (set (mapcat moves states)))))))

(let [valves (->> (read-input)
                  (map parse-valve)
                  (into {}))
      max-flow (->> valves vals (map :flow) sum)
      initial-state {:flow 0
                     :total-flown 0
                     :open #{}
                     :you "AA"}
      initial-state-2 (assoc initial-state :elephant "AA")
      moves (partial moves valves max-flow)
      moves-2 (partial moves-2 valves max-flow)]

  (println "Part 1:" (solve 30 moves initial-state))
  (println "Part 2:" (solve 26 moves-2 initial-state-2)))