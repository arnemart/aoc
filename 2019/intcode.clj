(ns aoc.2019.intcode
  (:require [clojure.core.async :refer [<! <!! >!! go]]
            [clojure.math.numeric-tower :as math :refer [expt]]))

;; intcode days: 2, 5, 7, 9

(defn get-param-addr [mem op ip rel-base param]
  (case (quot
         (mod op (* 100 (expt 10 param)))
         (expt 10 (inc param)))
    0 (get mem (+ ip param))
    1 (+ ip param)
    2 (+ rel-base (get mem (+ ip param)))))

(defn read-param-from-mem [mem addr param]
  (get mem (addr param) 0))

(defn step [state]
  (let [ip (:ip state)
        mem (:mem state)
        op (get mem ip 0)
        opcode (mod op 100)
        addr (partial get-param-addr mem op ip (:rel-base state))
        param (partial read-param-from-mem mem addr)] 

    (case opcode
      ;; add
      1 (-> state
            (update :ip + 4)
            (assoc-in [:mem (addr 3)]
                      (+ (param 1) (param 2))))
      ;; multiply
      2 (-> state
            (update :ip + 4)
            (assoc-in [:mem (addr 3)]
                      (* (param 1) (param 2))))
      ;; read input
      3 (let [s (-> state
                    (update :ip + 2)
                    (assoc-in [:mem (addr 1)]
                              (if (some? (:in-chan state))
                                (<!! (:in-chan state))
                                (first (:input state)))))]
          (if (nil? (:in-chan s))
            (update s :input #(drop 1 %))
            s))
      ;; write output
      4 (let [v (param 1)]
          (when (some? (:out-chan state))
            (>!! (:out-chan state) v))
          (-> state
              (update :ip + 2)
              (update :output #(conj % v))))
      ;; jump-if-true
      5 (update state :ip #(if (not= 0 (param 1))
                             (param 2)
                             (+ 3 %)))
      ;; jump-if-false
      6 (update state :ip #(if (= 0 (param 1))
                             (param 2)
                             (+ 3 %)))
      ;; less than
      7 (-> state
            (update :ip + 4)
            (assoc-in [:mem (addr 3)]
                      (if (< (param 1) (param 2)) 1 0)))
      ;; equals
      8 (-> state
            (update :ip + 4)
            (assoc-in [:mem (addr 3)]
                      (if (= (param 1) (param 2)) 1 0)))
      ;; adjust relative base
      9 (-> state
            (update :ip + 2)
            (update :rel-base + (param 1)))
      ;; halt
      99 (assoc state :halted true))))

(defn init-state [program]
  {:mem (into {} (map-indexed #(vector %1 %2) program))
   :output []
   :ip 0
   :rel-base 0
   :halted false})

(defn just-run [state]
  (if (:halted state)
    (do
      (when (some? (:finally state))
        ((:finally state)))
      {:mem (:mem state) :output (:output state)})
    (recur (step state))))

(defn run
  ([program]
   (just-run (init-state program)))
  ([input program]
   (just-run (assoc (init-state program) :input input)))
  ([in-chan out-chan program]
   (just-run (assoc (init-state program) :in-chan in-chan :out-chan out-chan)))
  ([in-chan out-chan program finally]
   (just-run (assoc (init-state program) :in-chan in-chan :out-chan out-chan :finally finally))))
