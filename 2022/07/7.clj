(ns aoc.2022.07.7
  (:require [aoc.common :refer [read-input sum]]
            [clojure.string :as str]
            [clojure.core.match :refer [match]]))

(defn build-folders
  ([cmds] (build-folders cmds {} []))
  ([cmds folders path]
   (if-let [[cmd & cmds] cmds]
     (match (str/split cmd #" ")
       ["$" "cd" ".."] (recur cmds folders (pop path))
       ["$" "cd" dir] (recur cmds folders (conj path dir))
       [(size :guard #(re-matches #"\d+" %)) _] (recur cmds
                                                       (->> (range (count path))
                                                            (map #(take (inc %) path))
                                                            (reduce #(assoc %1 %2 (+ (get %1 %2 0) (parse-long size))) folders))
                                                       path)
       :else (recur cmds folders path))
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