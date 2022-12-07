(ns aoc.2022.07.7
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]))

(defn build-folders
  ([cmds] (build-folders cmds {} []))
  ([cmds folders path]
   (if-let [[cmd & cmds] cmds]
     (let [parts (str/split cmd #" ")]
       (condp re-matches cmd
         #"\$ cd \.\." (recur cmds folders (pop path))
         #"\$ cd .+"   (recur cmds folders (conj path (last parts)))
         #"\d+ .+"     (recur cmds (->> (range (count path))
                                        (map #(take (inc %) path))
                                        (reduce #(assoc %1 %2 (+ (get %1 %2 0) (parse-long (first parts)))) folders)) path)
         (recur cmds folders path)))
     folders)))

(let [folders (build-folders (read-input))
      space-needed (- 30000000 (- 70000000 (get folders ["/"])))]

  (->> folders
       vals
       (filter #(<= % 100000))
       sum
       (println "Part 1:"))

  (->> folders
       vals
       (filter #(>= % space-needed))
       (apply min)
       (println "Part 2:")))