(ns aoc.2022.20.20
  (:require [aoc.common :refer [read-input sum]]))

(defn move [v from to]
  (cond
    (= from to) v
    (< from to) (vec (concat (subvec v 0 from) (subvec v (inc from) (inc to)) [(nth v from)] (subvec v (inc to))))
    (> from to) (vec (concat (subvec v 0 to) [(nth v from)] (subvec v to from) (subvec v (inc from))))))

(defn mix
  ([nums] (mix nums (vec (range (count nums)))))
  ([nums indexes]
   (loop [id 0 indexes indexes nums nums]
     (if (= (count nums) id)
       [nums indexes]
       (let [i (.indexOf indexes id)
             n (nth nums i)
             ni (mod (+ n i) (dec (count nums)))]
         (cond
           (= ni i) (recur (inc id) indexes nums)
           :else (recur (inc id) (move indexes i ni) (move nums i ni))))))))

(defn coords [nums]
  (let [z (.indexOf nums 0)]
    (->> [1000 2000 3000] (map #(nth nums (mod (+ z %) (count nums)))) sum)))

(let [nums (->> (read-input)
                (mapv parse-long))
      [mixed1] (mix nums)]

  (println "Part 1:" (coords mixed1))

  (loop [n 0 nums (mapv #(* 811589153 %) nums) indexes (vec (range (count nums)))]
    (if (= 10 n)
      (println "Part 2:" (coords nums))
      (let [[nums indexes] (mix nums indexes)]
        (recur (inc n) nums indexes)))))