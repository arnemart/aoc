(ns aoc.2022.05.5
  (:require [aoc.common :refer [read-input zipv]]
            [clojure.string :as str]))

(defn move-1 [stacks [num from to]]
  (if (zero? num)
    stacks
    (recur
     (-> stacks
         (update to conj (-> stacks (get from) last))
         (update from pop))
     [(dec num) from to])))

(defn move-2 [stacks [num from to]]
  (let [where (- (count (get stacks from)) num)]
    (-> stacks
        (update to #(vec (concat % (subvec (get stacks from) where))))
        (update from #(subvec % 0 where)))))

(let [[part1 part2] (->> (read-input :split-with #"\n\n")
                         (map #(str/split % #"\n")))
      stacks (->> part1
                  drop-last
                  (map #(str/split % #""))
                  (map (fn [stack]
                         (->> (range 1 34 4)
                              (map #(nth stack %)))))
                  (apply zipv)
                  (map reverse)
                  (mapv (fn [l] (vec (take-while #(not (str/blank? %)) l)))))
      ops (->> part2
               (map #(re-seq #"\d+" %))
               (map #(map parse-long %))
               (map (fn [[a b c]] [a (dec b) (dec c)])))]

  (->> ops
       (reduce move-1 stacks)
       (map last)
       str/join
       (println "Part 1:"))

  (->> ops
       (reduce move-2 stacks)
       (map last)
       str/join
       (println "Part 2:")))