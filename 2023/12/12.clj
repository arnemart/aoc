(ns aoc.2023.12.12 
  (:require [aoc.common :refer [read-input split-to-ints tee]]
            [clojure.string :as str]))

(def group-pattern (memoize (fn [n] (re-pattern (str "^[\\#\\?]{" n "}(\\.|\\?|$)")))))

(def count-variants
  (memoize
   (fn [[springs groups]]
     (let [first-char (first springs)
           group (first groups)
           skip #(count-variants [(subs springs 1) groups])]
       (cond
         (empty? groups) (if (re-find #"#" springs) 0 1)
         (nil? first-char) 0
         (= \. first-char) (skip)

         (re-find (group-pattern group) springs)
         (let [use-first-group (count-variants [(subs springs (min (inc group) (count springs))) (rest groups)])]
           (if (= \# first-char)
             use-first-group
             (+ use-first-group
                (skip))))

         (= \# first-char) 0
         (= \? first-char) (skip))))))

(let [springs (->> (read-input)
                   (map #(str/split % #" "))
                   (map #(tee [first (fn [[_ ns]] (split-to-ints ns))] %)))
      unfolded-springs (->> springs
                            (map (fn [[s ns]]
                                   [(str/join "?" (repeat 5 s))
                                    (apply concat (repeat 5 ns))])))]
  (->> springs
       (map count-variants)
       (apply +)
       (println "Part 1:"))
  (->> unfolded-springs
       (map count-variants)
       (apply +)
       (println "Part 2:")))