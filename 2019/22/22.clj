(ns aoc.2019.22.22 
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn increment [deck c]
  (let [len (count deck)]
    (vec (reduce-kv (fn [newdeck i v]
                      (assoc newdeck (mod (* i c) len) v))
                    (vec (repeat len nil))
                    deck))))

(defn op [deck [type arg]]
  (case type
    :reverse (vec (reverse deck))
    :cut (let [p (if (> arg 0) arg (+ arg (count deck)))]
           (vec (concat (subvec deck p) (subvec deck 0 p))))
    :increment (increment deck arg)))

(defn do-ops [deck ops]
  (reduce op deck ops))

(time
 (let [ops (->> (read-input)
                (map #(str/split % #" "))
                (map (fn [[type arg & rest]]
                       (case type
                         "cut" [:cut (parse-long arg)]
                         "deal" (case arg
                                  "with" [:increment (parse-long (last rest))]
                                  "into" [:reverse nil])))))]
   (println "Part 1:"
            (-> (vec (range 10007))
                (do-ops ops)
                (.indexOf 2019)))))