(ns aoc.2022.19.19
  (:require [aoc.common :refer [read-input sum]]
            [clojure.set :as set]))

(defn moves [blueprint state]
  (let [next-state (-> state
                       (update :ore + (:oreb state))
                       (update :clay + (:clayb state))
                       (update :obs + (:obsb state))
                       (update :geo + (:geob state)))]
    (->> [next-state
          ;; buy ore bot
          (when (>= (:ore state) (:ore (:oreb blueprint)))
            (-> next-state
                (update :ore - (:ore (:oreb blueprint)))
                (update :oreb inc)))
          ;; buy clay bot
          (when (>= (:ore state) (:ore (:clayb blueprint)))
            (-> next-state
                (update :ore - (:ore (:clayb blueprint)))
                (update :clayb inc)))
          ;; buy obsidian bot
          (when (and (>= (:ore state) (:ore (:obsb blueprint)))
                     (>= (:clay state) (:clay (:obsb blueprint))))
            (-> next-state
                (update :ore - (:ore (:obsb blueprint)))
                (update :clay - (:clay (:obsb blueprint)))
                (update :obsb inc)))
          ;; buy geode bot
          (when (and (>= (:ore state) (:ore (:geob blueprint)))
                     (>= (:obs state) (:obs (:geob blueprint))))
            (-> next-state
                (update :ore - (:ore (:geob blueprint)))
                (update :obs - (:obs (:geob blueprint)))
                (update :geob inc)))]
         (filter some?)
         set)))

(defn find-geodes [num blueprint state]
  (loop [i 0 states [state]]
    (if (= num i)
      (->> states
           (map :geo)
           (apply max))
      (let [new-states (->> states
                            (map #(moves blueprint %))
                            (apply set/union)
                            (sort-by #(+ (* 1000 (:geo %)) (* 1000 (:geob %)) (* 100 (:obsb %)) (* 10 (:clayb %)) (:oreb %)) >)
                            (take 30000))]
        (recur (inc i) new-states)))))

(let [blueprints (->> (read-input)
                      (map #(re-seq #"\d+" %))
                      (map #(map parse-long %))
                      (map (fn [[id oo co obo obc go gob]]
                             {:id id
                              :oreb {:ore oo}
                              :clayb {:ore co}
                              :obsb {:ore obo :clay obc}
                              :geob {:ore go :obs gob}})))
      state {:ore 0 :clay 0 :obs 0 :geo 0
             :oreb 1 :clayb 0 :obsb 0 :geob 0}]

  (->> blueprints
       (map #(* (:id %) (find-geodes 24 % state)))
       sum
       (println "Part 1:"))

  (->> blueprints
       (take 3)
       (map #(find-geodes 32 % state))
       (apply *)
       (println "Part 2:")))