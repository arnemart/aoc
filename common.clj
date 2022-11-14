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

(defn zip [lists]
  (apply (partial mapv vector) lists))

(defn spy [v] (pprint v) v)
