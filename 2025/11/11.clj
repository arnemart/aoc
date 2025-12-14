(ns aoc.2025.11.11
  (:require
   [aoc.common :refer [any-word lines parse-input]]
   [blancas.kern.core :refer [<$> <*> << sep-by space sym*]]))

(def count-paths
  (memoize (fn [devices [from to]]
             (->> (get devices from)
                  (map (fn [dev]
                         (if (= dev to)
                           1
                           (count-paths devices [dev to]))))
                  (apply +)))))

(let [devices (parse-input (<$> (partial into {})
                                (lines (<*> (<< (<$> keyword any-word) (sym* \:) space)
                                            (<$> (comp set (partial map keyword)) (sep-by space any-word))))))]
  (->> (count-paths devices [:you :out])
       (println "Part 1:"))

  (->>
   (+
    (->> [[:svr :dac] [:dac :fft] [:fft :out]]
         (map (partial count-paths devices))
         (apply *))
    (->> [[:svr :fft] [:fft :dac] [:dac :out]]
         (map (partial count-paths devices))
         (apply *)))
   (println "Part 2:")))
