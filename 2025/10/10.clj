(ns aoc.2025.10.10
  (:require
   [aoc.common :refer [inclusive-range lines nums parse-input]]
   [blancas.kern.core :refer [<$> <*> << <|> between many sep-end-by sym*
                              white-space]]
   [clojure.math.combinatorics :as combo]
   [loco.constraints :refer [$+ $= $in]]
   [loco.core :refer [solution]]))

(defn press-button [lights button]
  (->> button
       (reduce #(update %1 %2 not) lights)))

(defn turn-off-lights [[lights buttons]]
  (->> (inclusive-range 1 (count buttons))
       (mapcat #(combo/combinations buttons %))
       (map #(vector (reduce press-button lights %) %))
       (some #(when (every? false? (first %)) (count (last %))))))

(defn kw [i] (keyword (str i)))

(defn turn-on-machine [[_ buttons joltages]]
  (let [max-joltage (apply max joltages)
        buttons-for-joltages (->> joltages
                                  (map-indexed (fn [i _]
                                                 (->> buttons
                                                      (keep-indexed #(when (contains? %2 i) (kw %1)))
                                                      set))))
        model (-> [; x er fra max til 2*max
                   ($in :x max-joltage (* 2 max-joltage))
                   ; x er summen av alle knappetrykkene
                   ($= :x (->> (range (count buttons)) (map kw) (apply $+)))]
                  ; knappetrykkene er fra 0 til den minste joltage-verdien knappen påvirker
                  (concat (->> buttons
                               (map-indexed (fn [i b]
                                              ($in (kw i) 0
                                                   (->> joltages (keep-indexed #(when (contains? b %1) %2)) (apply min)))))))
                  ; joltagene er summen av alle knappene som påvirker joltagen
                  (concat (->> buttons-for-joltages
                               (map-indexed #($= (apply $+ %2) (nth joltages %1))))))]
    
    (:x (solution model :minimize :x :timeout (* 10 60 1000)))))

(let [machines (parse-input (lines (<*>  (<$> (comp vec (partial map #(= \# %))) (<< (between (sym* \[) (sym* \]) (many (<|> (sym* \.) (sym* \#)))) white-space))
                                         (<$> (partial map set) (sep-end-by white-space (between (sym* \() (sym* \)) nums)))
                                         (between (sym* \{) (sym* \}) nums))))]
  (->> machines
       (map turn-off-lights)
       (apply +)
       (println "Part 1:"))

  (->> machines
       (pmap turn-on-machine)
       (apply +)
       (println "Part 2:")))