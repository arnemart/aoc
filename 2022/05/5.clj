(ns aoc.2022.05.5
  (:require [aoc.common :refer [re-seq-indices read-input zip]]
            [clojure.string :as str]))

(defn move [& {:keys [reverse]}]
  (fn [stacks [num from to]]
    (let [where (- (count (get stacks from)) num)
          to-add ((if reverse rseq identity) (subvec (get stacks from) where))]
      (-> stacks
          (update to #(reduce conj % to-add))
          (update from subvec 0 where)))))

(defn solve [stacks ops move]
  (->> ops
       (reduce move stacks)
       (map last)
       str/join))

(let [[part1 part2] (->> (read-input :split-with #"\n\n")
                         (map #(str/split % #"\n")))
      crate-indices (re-seq-indices #"\d" (last part1))
      stacks (->> part1
                  drop-last
                  (map #(str/split % #""))
                  (map (fn [stack] (map #(nth stack %) crate-indices)))
                  (apply zip)
                  (map reverse)
                  (mapv (fn [l] (vec (take-while #(not (str/blank? %)) l)))))
      ops (->> part2
               (map #(re-seq #"\d+" %))
               (map #(map parse-long %))
               (map (fn [[a b c]] [a (dec b) (dec c)])))]

  (println "Part 1:" (solve stacks ops (move :reverse true)))
  (println "Part 2:" (solve stacks ops (move :reverse false))))