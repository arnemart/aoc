(ns aoc.2019.intcode
  (:require [clojure.core.async :refer [<! <!! >! go]]
            [clojure.math.numeric-tower :as math :refer [expt]]))

(defn read-param-from-mem [mem op ip param]
  (case (quot
         (mod op (* 100 (expt 10 param)))
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
      ;; read input
      3 (let [s (-> state
                    (update :ip #(+ 2 %))
                    (assoc-in [:mem (nth mem (+ ip 1))]
                              (if (some? (:in-chan state))
                                (<!! (go (<! (:in-chan state))))
                                (first (:input state)))))]
          (if (nil? (:in-chan s))
            (update s :input #(drop 1 %))
            s))
      ;; write output
      4 (let [v (read-param 1)]
          (when (some? (:out-chan state))
            (go (>! (:out-chan state) v)))
          (-> state
              (update :ip #(+ 2 %))
              (update :output #(conj % v))))
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

(defn init-state [program]
  {:mem program
   :output []
   :ip 0
   :halted false})

(defn just-run [state]
  (if (:halted state)
    (do
      (when (some? (:finally state))
        ((:finally state)))
      {:mem (:mem state) :output (:output state)})
    (just-run (step state))))

(defn run
  ([program]
   (just-run (init-state program)))
  ([input program]
   (just-run (assoc (init-state program) :input input)))
  ([in-chan out-chan program]
   (just-run (assoc (init-state program) :in-chan in-chan :out-chan out-chan)))
  ([in-chan out-chan program finally]
   (just-run (assoc (init-state program) :finally finally :in-chan in-chan :out-chan out-chan))))
