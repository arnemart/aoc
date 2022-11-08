(ns aoc.2019.intcode
  (:require [clojure.math.numeric-tower :as math :refer [expt]]))

(defn init-state 
  ([program]
   (init-state [] program))
  ([input program]
   {:mem program
    :output []
    :input input
    :ip 0
    :halted false}))

(defn read-param-from-mem [mem oc ip param]
  (case (quot
         (mod oc (* 100 (expt 10 param)))
         (expt 10 (inc param)))
    0 (nth mem (nth mem (+ ip param)))
    1 (nth mem (+ ip param))))

(defn step [state]
  (let [ip (:ip state)
        mem (:mem state)
        op (nth mem ip)
        opcode (mod op 100)
        read-param #(read-param-from-mem mem op ip %)]

    (case opcode
      ;; add
      1 (-> state
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (+ (read-param 1)
                         (read-param 2))))
      ;; multiply
      2 (-> state
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (* (read-param 1)
                         (read-param 2))))
      ;; read
      3 (-> state
            (update :ip #(+ 2 %))
            (assoc-in [:mem (nth mem (+ ip 1))] (first (:input state)))
            (update :input #(drop 1 %)))
      ;; write
      4 (-> state
            (update :ip #(+ 2 %))
            (update :output #(conj % (read-param 1))))
      ;; jump-if-true
      5 (update state :ip #(if (not= 0 (read-param 1))
                             (read-param 2)
                             (+ 3 %)))
      ;; jump-if-false
      6 (update state :ip #(if (= 0 (read-param 1))
                             (read-param 2)
                             (+ 3 %)))
      ;; less than
      7 (-> state
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (if (< (read-param 1) (read-param 2)) 1 0)))
      ;; equals
      8 (-> state
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (if (= (read-param 1) (read-param 2)) 1 0)))
      ;; halt
      99 (assoc state :halted true))))

(defn run [state]
  (if (:halted state)
    {:mem (:mem state) :output (:output state)}
    (run (step state))))
