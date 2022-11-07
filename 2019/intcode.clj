(ns aoc.2019.intcode)

(defn init-state [program]
  {:mem program
   :ip 0
   :halted false})

(defn step [state]
  (let [ip (:ip state) mem (:mem state)]
    (case (nth mem ip)
      1 (-> state 
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (+
                       (nth mem (nth mem (+ ip 1)))
                       (nth mem (nth mem (+ ip 2))))))
      2 (-> state
            (update :ip #(+ 4 %))
            (assoc-in [:mem (nth mem (+ ip 3))]
                      (*
                       (nth mem (nth mem (+ ip 1)))
                       (nth mem (nth mem (+ ip 2))))))
      99 (assoc state :halted true))))

(defn run [state]
  (if (:halted state)
    (first (:mem state))
    (run (step state))))

