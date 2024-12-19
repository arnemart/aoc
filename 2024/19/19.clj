(ns aoc.2024.19.19
  (:require
   [aoc.common :refer [any-word comma-or-space-sep lines parse-input]]
   [blancas.kern.core :refer [<*> >> new-line*]]
   [clojure.string :as str]))

(def count-combinations
  (memoize
   (fn [towels design]
     (if (= "" design)
       1
       (->> towels
            (keep #(when (str/starts-with? design %)
                     (subs design (count %))))
            (map #(count-combinations towels %))
            (apply +))))))

(let [[towels designs] (parse-input (<*> (comma-or-space-sep any-word)
                                         (>> new-line* new-line*
                                             (lines any-word))))
      combinations (->> designs
                        (map (partial count-combinations towels))
                        (filter #(> % 0)))]

  (println "Part 1:" (count combinations))
  (println "Part 2:" (apply + combinations)))
