(ns aoc.2023.13.13
  (:require [aoc.common :refer [read-input tee zip]]
            [clojure.math.combinatorics :as combo]
            [clojure.string :as str]))

(defn to-rows-and-cols [l]
  {:rows (vec l)
   :cols (mapv str/join (apply zip l))})

(defn reflection [but-not factor rows]
  (or
   (->> (range (dec (count rows)))
        (filter (fn [i]
                  (->>
                   (range i -1 -1)
                   (every? #(let [mirrored (get rows (+ i 1 (- i %)))]
                              (or (nil? mirrored)
                                  (= mirrored (get rows %))))))))
        (map inc)
        (map #(* factor %))
        (filter #(not= % but-not))
        first)
   0))

(defn reflections [but-not {:keys [rows cols]}]
  (+ (reflection but-not 100 rows) (reflection but-not 1 cols)))

(defn fix-smudge [landscape [y x]]
  (let [line (get landscape y)
        fixed-line (str (subs line 0 x) (if (= \# (.charAt line x)) \. \#) (subs line (inc x)))]
    (assoc landscape y fixed-line)))

(defn fix-smudges [landscape]
  (->> (combo/cartesian-product (range (count landscape))
                                (range (count (first landscape))))
       (map #(fix-smudge landscape %))))

(let [[landscapes unsmudged] (->> (read-input :split-with #"\n\n")
                                  (map #(str/split % #"\n"))
                                  (tee [#(map to-rows-and-cols %)
                                        #(map fix-smudges %)]))
      reflections-1 (mapv (partial reflections -1) landscapes)]

  (->> reflections-1
       (apply +)
       (println "Part 1:"))

  (->> unsmudged
       (map-indexed #(->> %2
                          (map to-rows-and-cols)
                          (map (partial reflections (nth reflections-1 %1)))
                          (filter pos?)
                          first))
       (apply +)
       (println "Part 2:")))