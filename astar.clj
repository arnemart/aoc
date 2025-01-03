(ns aoc.astar
  (:require [clojure.data.priority-map :refer [priority-map]]))

(defn- reconstruct-path [node]
  (cons (:data node)
        (when (some? (:parent node))
          (lazy-seq (reconstruct-path (:parent node))))))

(defn astar [& {:keys [start is-end get-neighbors calculate-cost heuristic hash validate-path]
                :or {calculate-cost (constantly 1)
                     heuristic (constantly 1)
                     hash hash}}]

  (loop [closed-map {}
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
               (> 0 (count closed-map)))) nil
      ;; Done!
      (is-end (:data node)) {:cost (:g node) :path (reconstruct-path node) :visited (->> closed-map (map (fn [[_ v]] [(:data v) v])) (into {}))}
      ;; Not done yet
      :else
      (let [hashed-data (hash (:data node))
            closed-map (assoc closed-map hashed-data (dissoc node :parent))
            open-map (dissoc open-map hashed-data)
            [priorities open-map]
            (->> (get-neighbors (:data node))
                 (filter #(not (contains? closed-map (hash %))))
                 ;; Validate path to this neighbor if we have a validate-path-function to call
                 (filter #(if (some? validate-path)
                            (validate-path (reconstruct-path {:data % :parent node}))
                            true))
                 (reduce
                  (fn [[priorities open-map] neighbor-data]
                    (let [neighbor-hash (hash neighbor-data)
                          g-from-this-node (+ (:g node) (calculate-cost (:data node) neighbor-data))]
                      (if
                       ;; We have seen this node before and already have a faster path to it
                       (and (contains? open-map neighbor-hash)
                            (< (get-in open-map [neighbor-hash :g]) g-from-this-node))
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

        (recur closed-map
               open-map
               (if (= 0 (count priorities)) priorities (pop priorities))
               (first (peek priorities)))))))
