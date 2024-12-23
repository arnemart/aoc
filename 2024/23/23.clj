(ns aoc.2024.23.23 
  (:require
   [aoc.common :refer [any-word lines parse-input spy]]
   [blancas.kern.core :refer [<*> >> any-char]]
   [clojure.math.combinatorics :refer [combinations]]
   [clojure.string :as str]
   [medley.core :refer [find-first]]))

(defn trios [computers conns]
  (->> (combinations computers 3)
       (filter (fn [[a b c]]
                 (every? #(contains? conns %) [#{a b} #{a c} #{b c}])))
       (map set)
       set))

(defn expand-group [group computers conns]
  (loop [group group]
    (if-let [next-comp (->> computers
                            (find-first #(and (not (contains? group %))
                                              (every? (fn [c] (contains? conns #{c %})) group))))]
      (recur (conj group next-comp))
      group)))

(defn groups [computers conns]
  (->> computers
       (map #(expand-group #{%} computers conns))))

(let [conns-list (parse-input (lines (<*> any-word (>> any-char any-word))))
      conns (set (map set conns-list))
      computers (->> conns-list flatten set)]

  (->> (trios computers conns)
       (filter (fn [trio]
                 (some #(str/starts-with? % "t") trio)))
       count
       (println "Part 1:"))

  (->> (groups computers conns)
       (sort-by count)
       spy
       last
       sort
       (str/join ",")
       (println "Part 2:")))
