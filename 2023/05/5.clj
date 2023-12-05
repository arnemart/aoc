(ns aoc.2023.05.5 
  (:require [aoc.common :refer [read-input split-to-ints tee]]
            [clojure.string :as str]))

(defn convert [n ms]
  (or
   (some (fn [[from to dest]]
           (when (<= from n to)
             (+ n (- dest from)))) ms)
   n))

(defn convert-slice [[ss se] [from to dest]]
  (cond
    (or (<= ss se from to) (<= from to ss se)) [[] [[ss se]]]
    (<= from ss se to) [[(+ ss (- dest from)) (+ se (- dest from))] []]
    (<= ss from se to) [[dest (+ se (- dest from))] [[ss from]]]
    (<= from ss to se) [[(+ ss (- dest from)) (+ to (- dest from))] [[to se]]]
    (<= ss from to se) [[dest (+ to (- dest from))] [[ss from] [to se]]]))

(defn convert-maps [s ms]
  (loop [done [] pending s [m & ms] ms]
    (let [[mapped leftover]
          (reduce (fn [[mapped leftover] p]
                    (let [[m l] (convert-slice p m)]
                      [(if (empty? m) mapped (conj mapped m)) (concat leftover l)]))
                  [[] []] pending)
          done (concat done mapped)]
      (if (empty? ms)
        (concat done leftover)
        (recur done leftover ms)))))

(let [[seeds maps]
      (->> (read-input :split-with #"\n\n")
           (tee [#(->> % first split-to-ints)
                 #(->> % rest
                       (map (fn [m]
                              (->> (str/split-lines m)
                                   (drop 1)
                                   (map split-to-ints)
                                   (map (fn [[dest source len]]
                                          [source (+ source len -1) dest]))))))]))
      seed-ranges (->> seeds
                       (partition 2)
                       (map (fn [[from len]]
                              [from (+ from len)])))]

  (->> seeds
       (map #(reduce convert % maps))
       (apply min)
       (println "Part 1:"))

  (->> maps
       (reduce convert-maps seed-ranges)
       (map first)
       (apply min)
       (println "Part 2:")))