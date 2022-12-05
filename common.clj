(ns aoc.common
  (:require [clojure.java.io :refer (file)]
            [clojure.pprint :refer [pprint]]
            [clojure.string :as str]))

(defn read-input [& {:keys [split-with test use-test] :or {split-with #"\n" test nil use-test true}}]
  (->
   (if (and (= true use-test) (some? test))
     test
     (-> *file*
         file
         .getParent
         (file "input.txt")
         slurp))
   (str/split split-with)))

(defn count-where [fn coll]
  (count (filter fn coll)))

(defn pick [keys coll]
  (map coll keys))

(defn zipv [& lists]
  (apply (partial mapv vector) lists))

(defn sum [& lists]
  (apply + (flatten lists)))

(defn spy [v] (pprint v) v)

(defn re-seq-indices [pattern string]
  (let [m (re-matcher pattern string)]
    ((fn step []
       (when (. m find)
         (cons (. m start) (lazy-seq (step))))))))