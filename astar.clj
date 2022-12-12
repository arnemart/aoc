(ns aoc.astar
  (:require [clojure.data.priority-map :refer [priority-map]]))

(defn- reconstruct-path
  ([node] (reconstruct-path node []))
  ([node path]
   (if (nil? (:parent node))
     [(:data node)]
     (recur (:parent node) (conj path (:data node))))))

(defn astar [& {:keys [start is-end get-neighbors calculate-cost heuristic hash]
                :or {calculate-cost (fn [_ _] 1) heuristic (fn [_] 1) hash identity}}]

  (loop [closed-set #{}
         open-map {}
         priorities (priority-map)
         node {:data start
               :g 0
               :h (heuristic start)
               :parent nil}]

    (cond
      ;; Did not find a path
      (or (nil? node)
          (and (= 0 (count priorities))
               (> 0 (count closed-set)))) nil
      ;; Done!
      (is-end (:data node)) {:cost (:g node) :path (reconstruct-path node)}
      ;; Not done yet
      :else
      (let [hashed-data (hash (:data node))
            closed-set (conj closed-set hashed-data)
            open-map (dissoc open-map hashed-data)
            [priorities open-map]
            (->> (get-neighbors (:data node))
                 (filter #(not (contains? closed-set (hash %))))
                 (reduce
                  (fn [[priorities open-map] neighbor-data]
                    (let [neighbor-hash (hash neighbor-data)
                          g-from-this-node (+ (:g node) (calculate-cost (:data node) neighbor-data))]
                      (if (and (contains? open-map neighbor-hash)
                               (< (get-in open-map [neighbor-hash :g]) g-from-this-node))
                        ;; We have seen this node before and already have a faster path to it
                        [priorities open-map]
                        (let [new-neighbor-node {:data neighbor-data
                                                 :parent node
                                                 :g g-from-this-node
                                                 :h (heuristic neighbor-data)}]
                          (if-let [old-neighbor-node (get open-map neighbor-hash)]
                            ;; Found a better route, update neighbor with this node as its new parent
                            [(-> priorities
                                 (dissoc old-neighbor-node)
                                 (assoc new-neighbor-node (+ g-from-this-node (:h new-neighbor-node))))
                             (assoc open-map neighbor-hash new-neighbor-node)]
                            ;; Add new neighbor to open nodes
                            [(assoc priorities new-neighbor-node (+ g-from-this-node (:h new-neighbor-node)))
                             (assoc open-map neighbor-hash new-neighbor-node)])))))
                  [priorities open-map]))]

        (recur closed-set open-map (if (= 0 (count priorities)) priorities (pop priorities)) (first (peek priorities)))))))
