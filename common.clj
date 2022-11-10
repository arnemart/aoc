(ns aoc.common
  (:require [clojure.edn :as edn]
            [clojure.java.io :refer (file)]
            [clojure.pprint :refer [pprint]]
            [clojure.string :as str]))

(defn read-input [& {:keys [split-with default use-default] :or {split-with #"\n" default nil use-default true}}]
  (->
   (if (and (= true use-default) (some? default))
     default
     (-> *file*
         file
         .getParent
         (file "input.txt")
         slurp))
   (str/split split-with)))

(defn count-where [fn coll]
  (count (filter fn coll)))

(defn pick [keys coll]
  (map #(get coll %) keys))

(defn zip [lists]
  (apply (partial mapv vector) lists))

(defn parse [s] (edn/read-string s))

(defn spy [v] (pprint v) v)
