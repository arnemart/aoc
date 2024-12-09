(ns aoc.common
  (:require
   [blancas.kern.core :refer [<$> <*> <|> any-char bind dec-num digit
                              get-position many many1 new-line* optional
                              return sep-by space sym* value]]
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

(defn parse-input [parser & {:keys [test use-test state] :or {test nil use-test true state {}}}] 
  (value parser
   (read-input-str :test test :use-test use-test) nil state))

(defn split-to-ints [s]
  (->> s
       (re-seq #"-?\d+")
       (map parse-long)))

(defn count-where [fn coll]
  (count (filter fn coll)))

(defn zip [& lists]
  (apply map (conj lists vector)))

(defn flip [f] (fn [a b] (f b a)))

(defn sum [& lists]
  (apply + 0 (filter some? (flatten lists))))

(defn ++ [a b]
  (cond (and (number? a) (number? b)) (+ a b)
        (and (number? a) (seqable? b)) (->> b (map #(+ a %)))
        (and (seqable? a) (number? b)) (->> a (map #(+ b %)))
        :else (->> (zip a b) (map #(apply + %)))))

(defn -- [a b]
  (++ a (if (number? b) (- b) (map - b))))

(defn remove-index [vect idx]
  (into (subvec vect 0 idx) (subvec vect (inc idx))))

(defn spy-with [f v] (f v) v)
(def spy (partial spy-with pprint))

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

;; Parsers
(defn lines [p] (sep-by new-line* p))
(defn comma-or-space-sep [p] (sep-by (<|> (<*> (sym* \,) (many space)) 
                                          (<*> (optional (sym* \,)) (many1 space))) p))
(def digit-num (<$> #(Character/digit % 10) digit))
(def nums (comma-or-space-sep dec-num))
(def points (<$> #(filter (fn [v] (not= \newline (first v))) %)
                 (many (bind [s any-char
                              p get-position]
                             (return [s (++ [(:line p) (:col p)] [-1 -2])])))))
