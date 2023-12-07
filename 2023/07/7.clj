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
               (= 5 largest-group) 7                    ; five of a kind
               (= 4 largest-group) 6                    ; four of a kind
               (and (= 2 groups) (= 3 largest-group)) 5 ; full house
               (and (= 3 groups) (= 3 largest-group)) 4 ; three of a kind
               (and (= 3 groups) (= 2 largest-group)) 3 ; two pair
               (= 4 groups) 2                           ; one pair
               :else 1)]                                ; a rock
    (vec (concat [type] cards))))

(defn classify-with-jokers [cards]
  (let [cards (map #(if (= 11 %) 1 %) cards)
        [type] (classify cards)
        num-jokers (->> cards (filter #(= 1 %)) count)
        new-type (match [type num-jokers]
                   [a 0] a
                   [(:or 5 6 7) _] 7
                   [4 _] 6
                   [3 2] 6
                   [3 1] 5
                   [2 _] 4
                   [1 1] 2)]
    (vec (concat [new-type] cards))))

(defn play [bets]
  (->> bets
       (sort #(compare (first %1) (first %2)))
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