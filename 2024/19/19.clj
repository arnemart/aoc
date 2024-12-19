(ns aoc.2024.19.19
  (:require
   [aoc.common :refer [any-word comma-or-space-sep lines parse-input]]
   [blancas.kern.core :refer [<$> <*> >> new-line*]]
   [clojure.string :as str]))

(defn possible [towels design]
  (if (= "" design)
    true
    (->> towels
         (keep #(when (str/starts-with? design %)
                  (subs design (count %))))
         (some (partial possible towels)))))

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

(let [[towels designs] (parse-input (<*> (<$> set (comma-or-space-sep any-word))
                                         (>> new-line* new-line*
                                             (lines any-word))))
      elemental-towels (filter #(not (possible (disj towels %) %)) towels)
      possible-designs (filter (partial possible elemental-towels) designs)]

  (println "Part 1:" (count possible-designs))

  (->> possible-designs
       (map (partial count-combinations towels))
       (apply +)
       (println "Part 2:")))
