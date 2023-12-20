(ns aoc.2023.20.20
  (:require [aoc.common :refer [read-input]]
            [clojure.math.numeric-tower :as math]
            [clojure.string :as str]))

(defn parse-node [s]
  (let [[_ type name to] (re-find #"^(%|&)?(\w+) -> (.+)$" s)
        to (str/split to #", ")]
    {:name name :type type :to to :on false :mem {}}))

(defn blank-mem [nodes node]
  (let [mem (->> nodes
                 (filter #(contains? (set (:to %)) (:name node)))
                 (map #(vector (:name %) :L))
                 (into {}))]
    (assoc node :mem mem)))

(defn update-mem [nodes]
  (->> nodes
       (map (fn [node]
              (if (= "&" (:type node))
                (blank-mem nodes node)
                node)))))

(defmulti send-signal (fn [_ _ node] (:type node)))

(defmethod send-signal "%" [s _ node]
  (let [to-send (if (:on node) :L :H)]
    (case s
      :H [node []]
      :L [(update node :on not) (map #(vector to-send (:name node) %) (:to node))])))

(defmethod send-signal "&" [s from node]
  (let [node (assoc-in node [:mem from] s)
        to-send (if (or (empty? (:mem node)) (every? #(= :H %) (vals (:mem node)))) :L :H)] 
    [node (map #(vector to-send (:name node) %) (:to node))]))

(defmethod send-signal nil [s _ node]
  [node (map #(vector s (:name node) %) (:to node))])

(defn send-signals [[nodes ss] [s from to]]
  (let [[node signals] (send-signal s from (get nodes to))]
    [(assoc nodes (:name node) node) (concat ss signals)]))

(defn push-button [[nodes counts]]
  (loop [[nodes signals] (send-signals [nodes []] [:L nil "button"]) counts counts]
    (if (empty? signals)
      [nodes counts]
      (recur (reduce send-signals [nodes []] signals)
             (reduce (fn [c [t]] (update c t inc)) counts signals)))))

(def who-signaled
  (memoize
   (fn [nodes]
     (loop [[nodes signals] (send-signals [nodes []] [:L nil "button"]) sent-signal #{}]
       (if (empty? signals)
         [nodes sent-signal]
         (recur (reduce send-signals [nodes []] signals)
                (->> signals
                     (filter #(= :H (first %)))
                     (reduce #(conj %1 (nth %2 1)) sent-signal))))))))

(defn push-button-until-signal [nodes name]
  (loop [[nodes sent-signal] (who-signaled nodes) i 1]
    (if (contains? sent-signal name) i
        (recur (who-signaled nodes) (inc i)))))

(defn find-to [nodes to]
  (->> nodes
       (filter #(contains? (set (get-in % [1 :to])) to))
       (map first)))

(let [nodes (->> (read-input)
                 (map parse-node)
                 update-mem
                 (map (juxt :name identity))
                 (into {}))
      nodes (assoc nodes "button" {:to ["broadcaster"]})]

  (->> [nodes {:L 0 :H 0}]
       (iterate push-button)
       (take 1001)
       last
       last
       vals
       (apply *)
       (println "Part 1:"))

  (->> (find-to nodes "rx")
       (mapcat #(find-to nodes %))
       (map #(push-button-until-signal nodes %))
       (reduce math/lcm)
       (println "Part 2:")))
