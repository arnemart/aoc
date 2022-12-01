(ns aoc.2022.01.1 
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn -main []
  (let [elves (->> (read-input :split-with #"\n\n")
                   (map #(str/split % #"\n"))
                   (map #(map parse-long %))
                   (map #(apply + %))
                   (sort >))]

    (println "Part 1:" (first elves))
    
    (println "Part 2:" (apply + (take 3 elves)))))
