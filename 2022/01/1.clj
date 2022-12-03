(ns aoc.2022.01.1 
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]))

(let [elves (->> (read-input :split-with #"\n\n")
                 (map #(str/split % #"\n"))
                 (map #(map parse-long %))
                 (map sum)
                 (sort >))]

  (println "Part 1:" (first elves))
  (println "Part 2:" (sum (take 3 elves))))
