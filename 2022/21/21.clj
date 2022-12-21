(ns aoc.2022.21.21
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn parse-monkey [s]
  (let [[name what] (str/split s #": ")]
    [name (if-let [n (parse-long what)]
            {:num n}
            (let [[_ m1 op m2] (re-matches #"^(\w+) ([\*\+\/\-]) (\w+)$" what)]
              {:num nil
               :m1 m1
               :op (eval (read-string op))
               :m2 m2}))]))

(defn yell [monkeys]
  (->> monkeys
       (map (fn [[name monkey]]
              (let [n1 (get-in monkeys [(:m1 monkey) :num])
                    n2 (get-in monkeys [(:m2 monkey) :num])]
                [name (if (and (some? n1) (some? n2))
                        (assoc monkey :num ((:op monkey) n1 n2))
                        monkey)])))
       (into {})))

(defn yell-all [monkeys]
  (loop [monkeys monkeys]
    (if-some [num (get-in monkeys ["root" :num])]
      num
      (recur (yell monkeys)))))

(defn find-humn [monkeys]
  (loop [num [9 9 9 9 9 9 9 9 9 9 9 9 9 9] digit 0]
    (let [n (parse-long (str/join num))
          res (yell-all (assoc-in monkeys ["humn" :num] n))]
      (cond
        (= 0 res) n
        (< 0 res) (recur (update num digit inc) (inc digit))
        (zero? (nth num digit)) (recur num (inc digit))
        :else (recur (update num digit dec) digit)))))

(let [monkeys (->> (read-input)
                   (map parse-monkey)
                   (into {}))
      monkeys2 (assoc-in monkeys ["root" :op] -)]

  (println "Part 1:" (yell-all monkeys))
  (println "Part 2:" (find-humn monkeys2)))