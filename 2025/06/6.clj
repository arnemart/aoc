(ns aoc.2025.06.6
  (:require
   [aoc.common :refer [parse-input read-input zip]]
   [blancas.kern.core :refer [<$> <*> << <|> digit many many1 new-line*
                              optional sep-by space sym*]]
   [clojure.string :as str]))

(let [problem-lines (parse-input (sep-by (<*> (optional (many space)) new-line*)
                                         (many (<$> (comp eval read-string (partial apply str))
                                                    (<< (many1 (<|> digit (sym* \*) (sym* \+)))
                                                        (optional (many space)))))))]
  (->> problem-lines
       (apply zip)
       (map #(apply (last %1) (drop-last %)))
       (apply +)
       (println "Part 1:"))

  (->> (read-input)
       (map (comp reverse #(str/split %1 #"")))
       (apply zip)
       (map (comp str/trim str/join))
       (partition-by empty?)
       (keep-indexed #(when (even? %1) %2))
       (map reverse)
       (map (fn [[n1 & ns]]
              (apply (->> n1 last str read-string eval)
                     (concat [(parse-long (str/trim (apply str (drop-last n1))))]
                             (map parse-long ns)))))
       (apply +)
       (println "Part 2:")))
