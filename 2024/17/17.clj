(ns aoc.2024.17.17
  (:require
   [aoc.common :refer [nums parse-input]]
   [blancas.kern.core :refer [<*> >> dec-num new-line* token*]]
   [clojure.math.numeric-tower :refer [expt]]
   [clojure.string :as str]))

(defn combo [state opr]
  (case opr
    (0 1 2 3) opr
    4 (:A state)
    5 (:B state)
    6 (:C state)))

(defn step [state]
  (let [i (:I state)
        opc (get-in state [:program i])
        opr (get-in state [:program (inc i)])]
    (when opc
      (case opc
        0 (-> state (update :A #(quot % (expt 2 (combo state opr)))) (update :I + 2))
        1 (-> state (update :B bit-xor opr) (update :I + 2))
        2 (-> state (assoc :B (mod (combo state opr) 8)) (update :I + 2))
        3 (-> state (assoc :I (if (zero? (:A state)) (+ i 2) opr)))
        4 (-> state (update :B bit-xor (:C state)) (update :I + 2))
        5 (-> state (update :stdout conj (mod (combo state opr) 8)) (update :I + 2))
        6 (-> state (assoc :B (quot (:A state) (expt 2 (combo state opr)))) (update :I + 2))
        7 (-> state (assoc :C (quot (:A state) (expt 2 (combo state opr)))) (update :I + 2))))))

(defn run [state]
  (->> state
       (iterate step)
       (take-while some?)
       last))

(defn valid-prefix [state digits]
  (let [{prog :program out :stdout} (run (assoc state :A (read-string (str \0 (apply str digits)))))]
    (= out (drop (- (count prog) (count out)) prog))))

(defn find-next-digit [state digits]
  (->> (range 8)
       (map #(conj digits %))
       (filter #(valid-prefix state %))))

(defn find-digits [state]
  (loop [candidates [[]]]
    (if (= (count (:program state)) (count (first candidates)))
      (first candidates)
      (recur (mapcat (partial find-next-digit state) candidates)))))

(let [[[A B C] program] (parse-input (<*> (<*> (>> (token* "Register A: ") dec-num)
                                               (>> new-line* (token* "Register B: ") dec-num)
                                               (>> new-line* (token* "Register C: ") dec-num))
                                          (>> new-line* new-line* (token* "Program: ") nums)))
      state {:A A :B B :C C :I 0 :stdout [] :program program}]

  (->> (run state)
       :stdout
       (str/join ",")
       (println "Part 1:"))

  (->> (find-digits state)
       (apply str)
       (str \0)
       read-string
       (println "Part 2:")))
