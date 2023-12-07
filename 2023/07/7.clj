(ns aoc.2023.07.7
  (:require [aoc.common :refer [read-input]]
            [clojure.core.match :refer [match]]
            [clojure.string :as str]))

(def card-values (->> (range 2 10)
                      (map #(vector (str %) %))
                      (into {})
                      (merge {"T" 10 "J" 11 "Q" 12 "K" 13 "A" 14})))

(defn classify [cards]
  (let [hand (frequencies cards)
        groups (count hand)
        largest-group (apply max (vals hand))
        type (cond
               (= 5 largest-group) 7
               (= 4 largest-group) 6
               (and (= 2 groups) (= 3 largest-group)) 5
               (and (= 3 groups) (= 3 largest-group)) 4
               (and (= 3 groups) (= 2 largest-group)) 3
               (= 4 groups) 2
               :else 1)]
    (concat [type] cards)))

(defn classify-with-jokers [cards]
  (let [cards (map #(if (= 11 %) 1 %) cards)
        [type] (classify cards)
        num-jokers (->> cards (filter #(= 1 %)) count)
        new-type (match [type num-jokers]
                   [a 0] a
                   [7 _] 7
                   [6 _] 7
                   [5 _] 7
                   [4 _] 6
                   [3 j] (+ 4 j)
                   [2 _] 4
                   [1 1] 2)]
    (concat [new-type] cards)))

(defn compare-hands [[[v1 & h1] _] [[v2 & h2] _]]
  (cond
    (not= v1 v2) (- v1 v2)
    (empty? h1) 0
    :else (compare-hands [h1] [h2])))

(defn play [bets]
  (->> bets
       (sort compare-hands)
       (map-indexed (fn [i [_ bet]] (* bet (inc i))))
       (apply +)))

(let [hands (->> (read-input)
                 (map #(str/split % #" "))
                 (map (fn [[h v]] [(->> (str/split h #"")
                                        (map #(get card-values %)))
                                   (parse-long v)])))
      bets1 (map (fn [[h b]] [(classify h) b]) hands)
      bets2 (map (fn [[h b]] [(classify-with-jokers h) b]) hands)]

  (println "Part 1:" (play bets1))
  (println "Part 2:" (play bets2)))