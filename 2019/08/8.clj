(ns aoc.2019.08.8
  (:require [aoc.common :refer [count-where pick read-input zip]]
            [clojure.string :as str]))

(let [w 25 h 6
      layers (->> (read-input :split-with #"")
                  (mapv parse-long)
                  (partition (* w h)))]

  (->> layers
       (sort-by #(count-where zero? %))
       first
       frequencies
       (pick [1 2])
       (apply *)
       (println "Part 1:"))

  (println "Part 2:")
  (->> layers
       (apply zip)
       (map (fn [px] (first (filter #(<= % 1) px))))
       (map #(get {0 " " 1 "#"} %))
       (partition w)
       (map #(str/join "" %))
       (str/join "\n")
       println))
