(ns aoc.2024.01.1 
  (:require
   [aoc.common :refer [read-input zip]]
   [clojure.string :as str]))

(let [[list1 list2] (->> (read-input)
                         (map #(str/split % #"\s+"))
                         (apply zip)
                         (map #(->> %
                                    (map parse-long)
                                    sort)))
      diff (->> [list1 list2]
                (apply zip)
                (map #(abs (apply - %))) 
                (apply +))
      freqs (frequencies list2)
      sim (->> list1 
               (map #(* % (get freqs % 0)))
               (apply +))]

  (println "Part 1:" diff)
  (println "Part 2:" sim))
