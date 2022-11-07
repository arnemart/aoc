(ns aoc.common
  (:require [clojure.java.io :refer (file)]
            [clojure.string :as str]
            [clojure.edn :as edn]
            [clojure.pprint :refer [pprint]]))

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

(defn parse [s] (edn/read-string s))


(defn spy [v] (pprint v) v)
