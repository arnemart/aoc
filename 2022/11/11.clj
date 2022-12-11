(ns aoc.2022.11.11
  (:require [aoc.common :refer [numeric? read-input]]
            [clojure.string :as str]))

(defn parse-monkey [s]
  {:items (as-> (re-find #"items: ([\d, ]+)" s) v
            (last v)
            (str/split v #", ")
            (mapv parse-long v))
   :op (let [[_ o v] (re-find #"new = old ([\*\+]) (\w+)" s)
             op (if (= "*" o) * +)]
         (if (numeric? v)
           (let [v (parse-long v)]
             (fn [i] (op i v)))
           (fn [i] (op i i))))
   :test (-> (re-find #"divisible by (\d+)" s) last parse-long)
   true (-> (re-find #"true: throw to monkey (\d+)" s) last parse-long)
   false (-> (re-find #"false: throw to monkey (\d+)" s) last parse-long)
   :inspections 0})

(defn step [manage-worry]
  (fn [monkeys i]
    (let [monkey (nth monkeys i)]
      (->> (:items monkey)
           (reduce (fn [monkeys item]
                     (let [w (-> item ((:op monkey)) manage-worry)]
                       (-> monkeys
                           (update-in [i :items] subvec 1)
                           (update-in [i :inspections] inc)
                           (update-in [(get monkey (= 0 (mod w (:test monkey)))) :items] conj w)))) 
                   monkeys)))))

(defn round [manage-worry]
  (fn [monkeys]
    (->> (range (count monkeys))
         (reduce (step manage-worry) monkeys))))

(defn monkey-business [rounds manage-worry monkeys]
  (->> monkeys
       (iterate (round manage-worry))
       (take (inc rounds))
       last
       (map :inspections)
       (sort >)
       (take 2)
       (apply *)))

(let [monkeys (->> (read-input :split-with #"\n\n")
                   (mapv parse-monkey))
      tests (->> monkeys
                 (map :test)
                 (apply *))]

  (->> monkeys
       (monkey-business 20 #(quot % 3))
       (println "Part 1:"))

  (->> monkeys
       (monkey-business 10000 #(mod % tests))
       (println "Part 2:")))