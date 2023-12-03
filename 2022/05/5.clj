(ns aoc.2022.05.5
  (:require [aoc.common :refer [re-seq-indexed read-input zip]]
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

(let [[stacks-input ops-input] (->> (read-input :split-with #"\n\n")
                                    (map str/split-lines))
      crate-indices (->> (last stacks-input)
                         (re-seq-indexed #"\d")
                         (map :start))
      stacks (->> stacks-input
                  drop-last
                  (map (fn [stack] (map #(.charAt stack %) crate-indices)))
                  (apply zip)
                  (map reverse)
                  (mapv (fn [l] (vec (take-while #(not= \space %) l)))))
      ops (->> ops-input
               (map #(re-seq #"\d+" %))
               (map #(map parse-long %))
               (map (fn [[a b c]] [a (dec b) (dec c)])))]

  (println "Part 1:" (solve stacks ops (move :reverse true)))
  (println "Part 2:" (solve stacks ops (move :reverse false))))