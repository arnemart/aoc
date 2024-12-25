(ns aoc.2024.25.25
  (:require
   [aoc.common :refer [lines parse-input zip]]
   [blancas.kern.core :refer [<$> << many new-line* one-of* optional]]
   [clojure.math.combinatorics :refer [cartesian-product]]))

(defn key-fits [[key lock]]
  (->> (zip key lock)
       (every? (fn [[k l]] (or (= k \.) (= l \.))))))

(let [{keys \. locks \#} (parse-input (<$> (partial group-by first)
                                           (lines (many (<< (one-of* "#.") (optional new-line*))))))]
  (->> (cartesian-product keys locks)
       (filter key-fits)
       count
       (println "Part 1:")))