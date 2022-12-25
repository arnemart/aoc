(ns aoc.2022.25.25
  (:require [aoc.common :refer [read-input sum]]
            [clojure.math.numeric-tower :refer [expt]]
            [clojure.string :as str]))

(defn inc! [n] (if (nil? n) 1 (inc n)))

(def sn {\= -2 \- -1 \0 0 \1 1 \2 2})
(defn snafu2dec [snafu]
  (->> snafu
       reverse
       (map-indexed #(* (expt 5 %1) (get sn %2)))
       sum))

(def powers (->> (range) (map #(expt 5 %))))
(defn biggest-power [n]
  (let [[i p] (->> powers
                   (take-while #(<= % n))
                   (map-indexed vector)
                   last)]
    [i (quot n p) (mod n p)]))

(defn correct-snafu [pows]
  (let [pow (->> pows (some #(when (> (last %) 2) %)))]
    (if (nil? pow)
      pows
      (let [[i n] pow]
        (recur (-> pows
                   (assoc i (- n 5))
                   (update (inc i) inc!)))))))

(def snr {-2 \= -1 \- 0 \0 1 \1 2 \2})
(defn make-snafu [pows]
  (let [max-pow (apply max (keys pows))]
    (->> (range max-pow -1 -1)
         (map #(get pows % 0))
         (map #(get snr %))
         (str/join))))

(defn dec2snafu [dec]
  (loop [remain dec pows []]
    (let [[pow c re] (biggest-power remain)
          pows (conj pows [pow c])]
      (if (zero? re)
        (->> pows
             (into {})
             correct-snafu
             make-snafu)
        (recur re pows)))))

(let [nums (read-input)]
  (->> nums
       (map snafu2dec)
       sum
       dec2snafu
       (println "Part 1:")))