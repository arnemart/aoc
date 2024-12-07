(ns aoc.2024.07.7
  (:require
   [aoc.common :refer [lines nums parse-input zip]]
   [blancas.kern.core :refer [<*> << dec-num token*]]
   [clojure.math.combinatorics :refer [selections]]))

(defn do-ops [ops [initial & vals]]
  (->> (zip ops vals)
       (reduce (fn [result [op val]]
                 (op result val)) initial)))

(defn possible [ops [sum vals]]
  (->> (selections ops (dec (count vals)))
       (some #(= sum (do-ops % vals)))))

(defn conc [n1 n2]
  (parse-long (str n1 n2)))

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
       (println "Part 2:")))