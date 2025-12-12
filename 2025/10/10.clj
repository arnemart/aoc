(ns aoc.2025.10.10
  (:require
   [aoc.common :refer [-- inclusive-range lines nums parse-input spy zip]]
   [blancas.kern.core :refer [<$> <*> << <|> between many sep-end-by sym*
                              white-space]]
   [clojure.math.combinatorics :as combo]))

(def t "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}")

(defn press-button-1 [lights button]
  (->> button
       (reduce #(update %1 %2 not) lights)))

(defn press-button-2 [joltages button]
  (->> button
       (reduce #(update %1 %2 inc) joltages)))

(defn turn-off-lights [[lights buttons]]
  (->> (inclusive-range 1 (count buttons))
       (mapcat #(combo/combinations buttons %))
       (map #(vector (reduce press-button-1 lights %) %))
       (some #(when (every? false? (first %)) (count (last %))))))

(defn turn-on-machine- [[_ buttons joltages]]
  (spy [buttons joltages])
  (let [highest-joltage (* 2 (apply max joltages))
        lowest-joltage (apply min joltages)
        shitload-of-buttons (->> buttons
                                 (mapcat (fn [button]
                                           (let [how-many (->> button
                                                               (map #(get joltages %))
                                                               (apply max))]
                                             (repeat how-many button))))
                                 shuffle)]
    (->> (inclusive-range lowest-joltage (count shitload-of-buttons))
         (mapcat #(combo/combinations shitload-of-buttons %))
         (filter #(<= (count %) highest-joltage))
         (map #(vector (reduce press-button-2 (vec (repeat (count joltages) 0)) %) %))
         (some #(when (= joltages (first %)) (count (last %))))
         spy)))

(defn difference [t j2]
  (let [diffs (->> (zip t j2) (map (fn [[a b]] (/ (- a b) a))))]
    (- (apply max diffs) (apply min diffs))))

(def cnt (atom 0))
(defn turn-on-machine [[_ buttons target-joltages]]
  (print (str "x " (* 4000 (count buttons)) " ") )
  (let [max-joltage (apply max target-joltages)]
    (loop [i 0 joltages #{(vec (repeat (count target-joltages) 0))}]
      (when (empty? joltages)
        (throw (Exception. (str "omg " target-joltages))))
      (if (and (>= i max-joltage) (some #(when (= target-joltages %) true) joltages))
        (do
          (swap! cnt inc)
          (println (str @cnt " " i))
          i)
        (recur (inc i) (->> joltages
                            (mapcat #(map (partial press-button-2 %) buttons))
                            (filter (fn [js] (every? #(>= % 0) (-- target-joltages js))))
                            set
                            (sort-by (partial difference target-joltages))
                            (take (* 10000 (count buttons)))))))))

(let [machines (parse-input (lines (<*>  (<$> (comp vec (partial map #(= \# %))) (<< (between (sym* \[) (sym* \]) (many (<|> (sym* \.) (sym* \#)))) white-space))
                                         (<$> (comp reverse (partial sort-by count)) (sep-end-by white-space (between (sym* \() (sym* \)) nums)))
                                         (between (sym* \{) (sym* \}) nums))) {:test t :use-test false})]
  (->> machines
       (map turn-off-lights)
       (apply +)
       (println "Part 1:"))

  (->> machines
       (pmap turn-on-machine)
       (apply +)
       (println "Part 2:")))