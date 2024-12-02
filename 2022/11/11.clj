(ns aoc.2022.11.11
  (:require
   [aoc.common :refer [nums parse-input]]
   [blancas.kern.core :refer [<$> <|> >> bind dec-num return sep-by skip-ws
                              token*]]))

(def monkey-parser
  (sep-by (token* "\n\n")
          (bind [id (>> (token* "Monkey")
                        (skip-ws dec-num))
                 items (>> (token* ":")
                           (skip-ws (token* "Starting items: "))
                           nums)
                 op (>> (skip-ws (token* "Operation: new = old"))
                        (<$> #(eval (read-string %)) (skip-ws (<|> (token* "+") (token* "*")))))
                 op-by (skip-ws (<|> dec-num (token* "old")))
                 test (>> (skip-ws (token* "Test: divisible by"))
                          (skip-ws dec-num))
                 if-true (>> (skip-ws (token* "If true: throw to monkey"))
                             (skip-ws dec-num))
                 if-false (>> (skip-ws (token* "If false: throw to monkey"))
                              (skip-ws dec-num))]
                (return {:id id :items items
                         :op (if (number? op-by)
                               #(op % op-by)
                               #(op % %))
                         :test test
                         :if {true if-true false if-false}
                         :inspections 0}))))

(defn step [manage-worry monkeys i]
  (let [monkey (nth monkeys i)]
    (->> (:items monkey)
         (reduce #(let [w (-> %2 ((:op monkey)) manage-worry)
                        pass-to (get-in monkey [:if (= 0 (mod w (:test monkey)))])]
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

(let [monkeys (parse-input monkey-parser)
      tests (->> monkeys
                 (map :test)
                 (apply *))]

  (->> monkeys
       (monkey-business 20 #(quot % 3))
       (println "Part 1:"))

  (->> monkeys
       (monkey-business 10000 #(mod % tests))
       (println "Part 2:")))