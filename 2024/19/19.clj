(ns aoc.2024.19.19
  (:require
   [aoc.common :refer [any-word comma-or-space-sep lines
                       parse-input]]
   [blancas.kern.core :refer [<$> <*> >> new-line*]]
   [clojure.string :as str]))

(defn possible [towels design]
  (if (= "" design)
    true
    (->> towels
         (keep #(when (str/starts-with? design %)
                  (subs design (count %))))
         (some (partial possible towels)))))

(let [[all-towels designs] (parse-input (<*> (<$> set (comma-or-space-sep any-word))
                                             (>> new-line* new-line*
                                                 (lines any-word))))
      towels (->> all-towels (filter #(not (possible (disj all-towels %) %))) set)
      possible-designs (filter (partial possible towels) designs)]

  (->> possible-designs
       count
       (println "Part 1:")))
