(ns aoc.2019.14.14
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(defn part [s]
  (let [[amt type] (str/split s #" ")]
    [(keyword type) (parse-long amt)]))

(defn merge-chemicals [chemicals]
  (->> chemicals
       (mapcat #(into [] %))
       (reduce (fn [chems [chem amt]]
                 (update chems chem #(+ amt (if (some? %) % 0)))) {})
       ))

(defn replace-one [reactions leftovers [chem amt]]
  (if
    (= :ORE chem) {:need {chem amt} :leftovers leftovers}
    (let [[amt leftovers] (if (= 0 (get leftovers chem 0))
                            [amt leftovers]
                            [(max 0 (- amt (get leftovers chem)))
                             (update leftovers chem #(max 0 (- % amt)))])
          {[_ amt-needed] :have need :need}
          (->> reactions (filter #(= chem (first (:have %)))))]
      (if (= 0 amt)
        {:need {} :leftovers leftovers}
        (loop [incr 1]
          (if (>= (* incr amt-needed) amt)
            {:need (->> need
                        (map (fn [[k v]] [k (* v incr)]))
                        (into {}))
             :leftovers (update leftovers chem #(+ (- (* incr amt-needed) amt) (if (some? %) % 0)))}
            (recur (inc incr))))))))

(defn step [reactions chemicals]
  (->> chemicals
       :need
       (reduce (fn [{need :need leftovers :leftovers} chem]
                 (let [res (replace-one reactions leftovers chem)]
                   {:need (merge-chemicals [need (:need res)])
                    :leftovers (:leftovers res)}))
               {:leftovers (:leftovers chemicals)})))

(defn ore-needed [step chemicals]
  (loop [next-chems chemicals]
    (if (= [:ORE] (keys (:need next-chems)))
      next-chems
      (recur (step next-chems)))))

(let [reactions (->> (read-input)
                     (map #(str/split % #" => "))
                     (map (fn [[from to]]
                            {:have (part to)
                             :need (->> (str/split from #", ")
                                        (map part)
                                        (into {}))})))
      step (partial step reactions)
      onefuel (ore-needed step {:need {:FUEL 1} :leftovers {}})]

  (->> onefuel
       :need
       :ORE
       (println "Part 1:"))

  (loop [total-ore (->> onefuel :need :ORE) fuel 0 leftovers (:leftovers onefuel)]
    (if (>= total-ore 1000000000000)
      (println "Part 2" fuel)
      (let [result (ore-needed step {:need {:FUEL 1} :leftovers leftovers})]
        (recur (+ total-ore (->> result :need :ORE)) (inc fuel) (:leftovers result))))))
