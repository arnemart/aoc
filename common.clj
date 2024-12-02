(ns aoc.common
  (:require
   [blancas.kern.core :as kern :refer [<*> dec-num many new-line* optional
                                       sep-by space sym*]]
   [clojure.java.io :refer [file]]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as str]))

(defn read-input-str [& {:keys [test use-test] :or {test nil use-test true}}]
  (if (and use-test (some? test))
    test
    (-> *file*
        file
        .getParent
        (file "input.txt")
        slurp)))

(defn read-input [& {:keys [split-with test use-test] :or {split-with #"\n" test nil use-test true}}]
  (->
   (read-input-str :test test :use-test use-test)
   (str/split split-with)))

(defn parse-input [parser & {:keys [test use-test] :or {test nil use-test true}}] 
  (kern/value parser
   (read-input-str :test test :use-test use-test)))

(defn lines [p] (sep-by new-line* p))
(defn comma-or-space-sep [p] (sep-by (<*> (optional (sym* \,)) (many space)) p))
(def nums (comma-or-space-sep dec-num))

(defn split-to-ints [s]
  (->> s
       (re-seq #"-?\d+")
       (map parse-long)))

(defn count-where [fn coll]
  (count (filter fn coll)))

(defn zip [& lists]
  (apply map (conj lists vector)))

(defn reduce-right
  ([f v vs]
   (loop [v v vs vs]
     (if (empty? vs)
       v
       (recur (f (first vs) v) (rest vs)))))
  ([f [v & vs]]
   (reduce-right f v vs)))

(defn sum [& lists]
  (apply + 0 (filter some? (flatten lists))))

(defn remove-index [l p]
  (into (subvec l 0 p) (subvec l (inc p))))

(defn spy [v] (pprint v) v)

(defn re-seq-indexed [pattern string]
  (let [m (re-matcher pattern string)]
    ((fn step []
       (when (. m find)
         (cons {:match (. m group) 
                :start (. m start)
                :end (. m end)} (lazy-seq (step))))))))

(defn numeric? [s] (re-matches #"\-?\d+" s))

(defn find-index [f coll]
  (->> coll (keep-indexed #(when (f %1 %2) %1)) first))

(defn tee [fs val]
  (map #(% val) fs))

(defn inclusive-range [a b]
  (range (min a b) (inc (max a b))))

(defn manhattan [p1 p2]
  (->> (zip p1 p2)
       (map (fn [[v1 v2]] (abs (- v1 v2))))
       sum))