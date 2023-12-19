(ns aoc.2023.19.19 
  (:require [aoc.common :refer [read-input]]
            [clojure.string :as str]))

(let [a (read-string "if")]
  (eval `(~a true 1 2)))

(defn parse-workflow [s]
  (let [[_ name rest] (re-find #"^(\w+)\{(.+)\}$" s)
        parts (str/split rest #",")
        finally (last parts)
        part (gensym)]
    [name
     (eval `(fn [~part]
              (cond
                ~@(->> parts
                       butlast
                       (mapcat #(let [[_ n p v w] (re-find #"^(\w+)(.)(\d+):(\w+)$" %)]
                                  `((~(read-string p) (get ~part ~n) ~(parse-long v)) ~w))))
                :else ~finally)))]))

(defn parse-part [s]
  (-> s
      (str/replace "=" " ")
      (str/replace #"([a-z])" "\"$1\"")
      read-string
      eval))

(defn accepted [workflows part]
  (loop [wf "in"]
    (case wf
      "A" true
      "R" false
      (recur ((get workflows wf) part)))))

(let [[workflows-s parts-s] (read-input :split-with #"\n\n")
      workflows (->> workflows-s
                     str/split-lines
                     (map parse-workflow)
                     (into {}))
      parts (->> parts-s
                 str/split-lines
                 (map parse-part))]
  (->> parts
       (filter (partial accepted workflows))
       (map #(apply + (vals %)))
       (apply +)
       (println "Part 1:")))
