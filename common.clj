(ns aoc.common
  (:require [clojure.java.io :refer [file]]
            [clojure.pprint :refer [pprint]]
            [clojure.string :as str]))

(defn read-input [& {:keys [split-with test use-test] :or {split-with #"\n" test nil use-test true}}]
  (->
   (if (and use-test (some? test))
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

(defn zip [& lists]
  ((fn step [lists]
     (when (every? not-empty lists)
       (cons (map first lists) (lazy-seq (step (map rest lists)))))) lists))

(defn sum [& lists]
  (apply + 0 (filter some? (flatten lists))))

(defn spy [v] (pprint v) v)

(defn re-seq-indices [pattern string]
  (let [m (re-matcher pattern string)]
    ((fn step []
       (when (. m find)
         (cons (. m start) (lazy-seq (step))))))))

(defn take-until [pred coll]
  (lazy-seq
   (when-let [[f & r] (seq coll)]
     (if (pred f)
       [f]
       (cons f (take-until pred r))))))

(defn numeric? [s] (re-matches #"\d+" s))

(defn find-index [f coll]
  (->> coll (keep-indexed #(when (f %1 %2) %1)) first))

(defn tee [fs val]
  (map #(% val) fs))