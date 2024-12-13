(ns aoc.2024.13.13 
  (:require
   [aoc.common :refer [++ parse-input]]
   [blancas.kern.core :refer [dec-num many search]]))

(defn prize [[[ax ay] [bx by] [px py]]]
  (let [a (/ (- (* by px) (* bx py))
             (- (* by ax) (* bx ay)))
        b (/ (- px (* ax a)) bx)]
    (if (and (int? a) (int? b))
      (+ (* a 3) b)
      0)))

(let [machines (->> (parse-input (many (search dec-num)))
                    (partition 2)
                    (partition 3))

      machines-2 (->> machines
                      (map (fn [[a b p]]
                             [a b (++ p [10000000000000 10000000000000])])))]

  (->> machines
       (map prize)
       (apply +)
       (println "Part 1:"))

  (->> machines-2
       (map prize)
       (apply +)
       (println "Part 2:")))