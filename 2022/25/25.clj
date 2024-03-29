(ns aoc.2022.25.25
  (:require [aoc.common :refer [read-input sum]]
            [clojure.math.numeric-tower :refer [expt]]
            [clojure.set :refer [map-invert]]
            [clojure.string :as str]))

(def sn {\= -2 \- -1 \0 0 \1 1 \2 2})
(def snr (map-invert sn))

(defn snafu2dec [snafu]
  (->> snafu
       reverse
       (map-indexed #(* (expt 5 %1) (get sn %2)))
       sum))

(defn correct-snafu [pows]
  (let [pow (some #(when (> (last %) 2) %) pows)]
    (if (nil? pow)
      pows
      (let [[i n] pow]
        (recur (-> pows
                   (assoc i (- n 5))
                   (update (inc i) inc)))))))

(defn make-snafu [pows]
  (->> (range (apply max (keys pows)) -1 -1)
       (map #(get snr (get pows % 0)))
       str/join))

(defn dec2snafu [dec]
  (->> (str/split (Long/toString dec 5) #"")
       reverse
       (map parse-long)
       (map-indexed vector)
       (into {})
       correct-snafu
       make-snafu))

(->> (read-input)
     (map snafu2dec)
     sum
     dec2snafu
     (println "Part 1:"))