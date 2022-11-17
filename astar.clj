(ns aoc.astar
  (:require [clojure-heap.core :as heap]))

(defn reconstruct-path [node]
  (if (nil? (:parent node))
    [(:data node)]
    (conj (reconstruct-path (:parent node)) (:data node))))

(defn heap-replace [h v1 v2]
  (->> h
       .getArr
       persistent!
       (filterv #(not= v1 %))
       transient
       (.setArr h))
  (heap/add h v2)) 

(defn astar [& {:keys [start is-end get-neighbors calculate-cost heuristic] :or {calculate-cost (fn [_ _] 1) heuristic (fn [_] 1)}}]
  (let [start-h (heuristic start)
        start-node {:data start
                    :g 0
                    :h start-h
                    :f start-h
                    :parent nil}]

    (loop [closed-set #{} 
           open-heap (heap/heap #(< (:f %1) (:f %2)))
           open-map {}
           node start-node
           first-run true]

      (cond
        ;; Did not find a path
        (and (not first-run)
             (= 0 (heap/get-size open-heap))) nil
        ;; Done!
        (is-end (:data node)) {:cost (:g node) :path (reconstruct-path node)}
        ;; Not done yet
        :else
        (let [closed-set (conj closed-set (:data node))
              open-map (dissoc open-map (:data node))
              open-map 
              (->> (get-neighbors (:data node))
                   (filter #(not (contains? closed-set %)))
                   (reduce
                    (fn [open-map neighbor-data]
                      (let [g-from-this-node (+ (:g node) (calculate-cost (:data node) neighbor-data))]
                        (if (contains? open-map neighbor-data)
                                          ;; We have seen this node before
                          (let [neighbor-node (get open-map neighbor-data)]
                            (if (< (:g neighbor-node) g-from-this-node)
                                              ;; Skip it, another route is faster
                              open-map
                                              ;; Found a better route, update existing neighbor with this node as its new parent
                              (let [new-neighbor-node {:data neighbor-data
                                                       :parent node
                                                       :g g-from-this-node
                                                       :h (heuristic neighbor-data)
                                                       :f (+ g-from-this-node (:h neighbor-node))}]
                                (heap-replace open-heap neighbor-node new-neighbor-node)
                                (assoc open-map neighbor-data new-neighbor-node))))
                                          ;; Add new neighbor to open nodes
                          (let [h (heuristic neighbor-data)
                                new-neighbor-node {:data neighbor-data
                                                   :parent node
                                                   :g g-from-this-node
                                                   :h h
                                                   :f (+ g-from-this-node h)}]
                            (heap/add open-heap new-neighbor-node)
                            (assoc open-map neighbor-data new-neighbor-node))))) open-map))]

          (recur closed-set open-heap open-map (heap/poll open-heap) false))))))
