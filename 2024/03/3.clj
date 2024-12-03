(ns aoc.2024.03.3
  (:require
   [aoc.common :refer [parse-input]]
   [blancas.kern.core :refer [<|> bind dec-num get-state many modify-state
                              return search sym* token*]]))

(def mul (bind [_ (token* "mul(")
                n1 dec-num
                _ (sym* \,)
                n2 dec-num
                _ (sym* \))
                state get-state]
               (if (:skip state)
                 (return nil)
                 (return [n1 n2]))))

(def dont (bind [_ (token* "don't()")
                 _ (modify-state assoc :skip true)] (return nil)))

(def do (bind [_ (token* "do()")
               _ (modify-state assoc :skip false)] (return nil)))

(defn mulsum [l]
  (->> l (filter some?) (map #(apply * %)) (apply +)))

(let [muls (parse-input (many (search mul)))
      muls2 (parse-input (many (search (<|> mul do dont))))]
  (println "Part 1:" (mulsum muls))
  (println "Part 2:" (mulsum muls2)))
