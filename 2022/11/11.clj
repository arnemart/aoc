(ns aoc.2022.11.11
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))
 
(defn parse-monkey [s]
  {:items (as-> (re-find #"items: ([\d, ]+)" s) v
            (last v)
            (str/split v #", ")
            (mapv parse-long v))
   :op (let [[_ o v] (re-find #"new = old ([\*\+]) (\w+)" s)
             op (get {"*" * "+" +} o)]
         (if-let [v (parse-long v)]
           #(op % v)
           #(op % %)))
   :test (-> (re-find #"divisible by (\d+)" s) last parse-long)
   true  (-> (re-find #"true: throw to monkey (\d+)" s) last parse-long)
   false (-> (re-find #"false: throw to monkey (\d+)" s) last parse-long)
   :inspections 0}) 

(defn step [manage-worry monkeys i]
  (let [monkey (nth monkeys i)]
    (->> (:items monkey)
         (reduce #(let [w (-> %2 ((:op monkey)) manage-worry)
                        pass-to (get monkey (= 0 (mod w (:test monkey))))]
                    (-> %1
                        (update-in [i :items] subvec 1)
                        (update-in [i :inspections] inc)
                        (update-in [pass-to :items] conj w)))
                 monkeys))))

(defn round [manage-worry monkeys]
  (->> (range (count monkeys))
       (reduce (partial step manage-worry) monkeys)))

(defn monkey-business [rounds manage-worry monkeys]
  (->> monkeys
       (iterate (partial round manage-worry))
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