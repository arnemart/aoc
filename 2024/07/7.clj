(ns aoc.2024.07.7
  (:require
   [aoc.common :refer [lines nums parse-input]]
   [blancas.kern.core :refer [<*> << dec-num token*]]
   [clojure.math.combinatorics :refer [selections]]))

(defn do-ops [[op & ops] [val & vals]]
  (if (nil? op)
    val
    (op val (do-ops ops vals))))

(defn possible [ops [sum vals]]
  (->> (selections ops (dec (count vals)))
       (some #(= sum (do-ops % (reverse vals))))))

(defn conc [n1 n2]
  (parse-long (str n2 n1)))

(let [input (parse-input (lines (<*> (<< dec-num (token* ": ")) nums)))
      possible-part-2 (filter (partial possible [+ * conc]) input)]

  (->> possible-part-2
       (filter (partial possible [+ *]))
       (map first)
       (apply +)
       (println "Part 1:"))

  (->> possible-part-2
       (map first)
       (apply +)
       (println "Part 1:")))