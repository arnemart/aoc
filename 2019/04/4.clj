(ns aoc.2019.04.4 
  (:require [clojure.string :as str]))

(defn -main []
  (let [pattern1 (->> (range 10)
                      (map #(str % "[0-" (max 0 (- % 1)) "]"))
                      (str/join "|")
                      re-pattern)
        filtered1 (->> (range 193651 649730)
                       (map str)
                       (filter #(not (re-find pattern1 %)))
                       (filter #(re-find #"(.)\1" %)))
        pattern2 (->> (range 10)
                      (map #(str "(^|[^" % "])" % % "($|[^" % "])"))
                      (str/join "|")
                      re-pattern)
        filtered2 (->> filtered1
                       (filter #(re-find pattern2 %)))]
    (println "Part 1:" (count filtered1))
    (println "Part 2:" (count filtered2))))
