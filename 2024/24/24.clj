(ns aoc.2024.24.24
  (:require
   [aoc.common :refer [lines parse-input]]
   [blancas.kern.core :refer [<$> <*> << <|> >> alpha-num dec-num many
                              many-till new-line* space token*]]
   [clojure.string :as str]))

(defn bin [strs]
  (->> strs
       reverse
       (concat ["2r"])
       (apply str)
       read-string))

(defn get-output [inputs outputs]
  (let [GET (memoize
             (fn [w]
               (if-let [o (get inputs w)]
                 o
                 (eval (get outputs w)))))
        AND (fn [a b]
              (if (and (= 1 (GET a)) (= 1 (GET b))) 1 0))
        OR (fn [a b]
             (if (or (= 1 (GET a)) (= 1 (GET b))) 1 0))
        XOR (fn [a b]
              (if (and (or (= 1 (GET a)) (= 1 (GET b)))
                       (not (and (= 1 (GET a)) (= 1 (GET b))))) 1 0))]
    (->> (keys outputs)
         (filter #(str/starts-with? % "z"))
         sort
         (map GET)
         bin)))

(defn get-input-num [inputs which]
  (->> inputs
       (filter (fn [[k]] (str/starts-with? k which)))
       (map last)
       sort
       bin))

(def wire (<$> (partial apply str) (many alpha-num)))
(let [[inputs outputs]
      (parse-input (<*> (<$> (partial into {}) (many-till (<< (<*> wire (>> (token* ": ") dec-num)) new-line*) new-line*))
                        (<$> #(->> % (map (fn [[i1 op i2 out]] [out `(~(read-string op) ~i1 ~i2)])) (into {}))
                             (lines (<*> wire (>> space (<|> (token* "AND") (token* "OR") (token* "XOR")))
                                         (>> space wire) (>> (token* " -> ") wire))))))
      x (get-input-num inputs "x")
      y (get-input-num inputs "y")]

  (println "Part 1:" (get-output inputs outputs)))