(ns aoc.2023.18.18
  (:require [aoc.common :refer [manhattan read-input tee]]))

(defn trench-area [trench]
  (->> trench
       (partition 2 1)
       (map #(apply manhattan %))
       (apply +)))

(defn dig2 [dug [dir dist]]
  (let [[y x] (last dug)
        pos (case dir
              "U" [(- y dist) x]
              "D" [(+ y dist) x]
              "L" [y (- x dist)]
              "R" [y (+ x dist)])]
    (conj dug pos)))

(defn x-values [y-list y]
  (->> y-list
       (filter (fn [[y1 y2]]
                 (<= y1 y y2)))
       (map last)
       set))

(defn dig-row [x-list x-values [sum memo] y]
  (let [x-vals-above (x-values (dec y))
        x-vals-cur (x-values y)
        x-vals-below (x-values (inc y))
        h (hash [x-vals-above x-vals-cur x-vals-below])]
    (if-let [result (get memo h)]
      [(+ sum result) memo]
      (let [xs (->> x-vals-cur
                    (map (fn [px]
                           (let [has-above (contains? x-vals-above px)
                                 has-below (contains? x-vals-below px)]
                             [px (cond
                                   (and has-above has-below) :s
                                   has-above :a
                                   has-below :b)])))
                    (into {}))
            xvs (set (keys xs))
            result (->> x-vals-cur
                        sort
                        (partition 2 1)
                        (map (fn [[x1 x2]]
                               [(inc x1) x2]))
                        (filter (fn [[x]]
                                  (not (some (fn [[py x1 x2]]
                                               (and (= py y)
                                                    (<= x1 x x2))) x-list))))
                        (filter (fn [[x]]
                                  (->> xvs
                                       (filter #(< % x))
                                       (filter #(or (= :a (get xs %)) (= :s (get xs %))))
                                       count
                                       odd?)))
                        (map (fn [[x1 x2]] (- x2 x1)))
                        (apply +))]
        [(+ sum result) (assoc memo h result)]))))

(defn dig-and-fill [input]
  (let [trench (->> input
                    (reduce dig2 [[0 0]]))
        [min-y max-y] (->> trench (map first) (tee [#(apply min %) #(apply max %)]))
        y-list (->> trench
                    (partition 2 1)
                    (filter #(apply = (map last %)))
                    (map (fn [[[y1 x] [y2]]] [(min y1 y2) (max y1 y2) x])))
        x-list (->> trench
                    (partition 2 1)
                    (filter #(apply = (map first %)))
                    (map (fn [[[y x1] [_ x2]]] [y (min x1 x2) (max x1 x2)]))
                    sort)
        x-values (memoize (partial x-values y-list))
        dig-row (partial dig-row x-list x-values)]

    (->> (range (inc min-y) max-y)
         (reduce dig-row [0 {}])
         first
         (+ (trench-area trench)))))

(let [input (->> (read-input)
                 (map #(re-find #"(\w) (\d+) \(#(\w+)\)" %))
                 (map (fn [[_ d n c]] [d (parse-long n) c])))
      input-2 (->> input
                   (map (fn [[_ _ c]]
                          [(get {"0" "R" "1" "D" "2" "L" "3" "U"} (subs c 5 6))
                           (Long/parseLong (subs c 0 5) 16)])))]

  (println "Part 1:" (dig-and-fill input))
  (println "Part 2:" (dig-and-fill input-2)))