(ns aoc.astar
  (:require [clojure.data.priority-map :refer [priority-map]]))

(defn reconstruct-path 
  ([node] (reconstruct-path node []))
  ([node path]
   (if (nil? (:parent node))
     [(:data node)]
     (recur (:parent node) (conj path (:data node))))))

(defn astar [& {:keys [start is-end get-neighbors calculate-cost heuristic]
                :or {calculate-cost (fn [_ _] 1) heuristic (fn [_] 1)}}]

  (loop [closed-set #{}
         open-map {}
         priorities (priority-map)
         node {:data start
               :g 0
               :h (heuristic start)
               :parent nil}]

    (cond
      ;; Did not find a path
      (and (= 0 (count priorities))
           (> 0 (count closed-set))) nil
      ;; Done!
      (is-end (:data node)) {:cost (:g node) :path (reconstruct-path node)}
      ;; Not done yet
      :else (let [closed-set (conj closed-set (:data node))
                  open-map (dissoc open-map (:data node))
                  [priorities open-map]
                  (->> (get-neighbors (:data node))
                       (filter #(not (contains? closed-set %)))
                       (reduce
                        (fn [[priorities open-map] neighbor-data]
                          (let [g-from-this-node (+ (:g node) (calculate-cost (:data node) neighbor-data))
                                new-neighbor-node {:data neighbor-data
                                                   :parent node
                                                   :g g-from-this-node
                                                   :h (heuristic neighbor-data)}]
                            (if (contains? open-map neighbor-data)
                              ;; We have seen this node before
                              (let [neighbor-node (get open-map neighbor-data)]
                                (if (< (:g neighbor-node) g-from-this-node)
                                  ;; Skip it, another route is faster
                                  [priorities open-map]
                                  ;; Found a better route, update existing neighbor with this node as its new parent
                                  [(-> priorities
                                       (dissoc neighbor-node)
                                       (assoc new-neighbor-node (+ g-from-this-node (:h new-neighbor-node))))
                                   (assoc open-map neighbor-data new-neighbor-node)]))
                              ;; Add new neighbor to open nodes
                              [(assoc priorities new-neighbor-node (+ g-from-this-node (:h new-neighbor-node)))
                               (assoc open-map neighbor-data new-neighbor-node)])))
                        [priorities open-map]))]

              (recur closed-set open-map (pop priorities) (first (peek priorities)))))))
