(ns aoc.2022.01.1 
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn -main []
  (let [elves (->> (read-input :split-with #"\n\n")
                   (map #(str/split % #"\n"))
                   (map #(map parse-long %))
                   (map #(apply + %)))]
    (->> elves
         (apply max)
         (println "Part 1:"))
    
    (->> elves
         (sort >)
         (take 3)
         (apply +)
         (println "Part 2:"))))