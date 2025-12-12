(ns aoc.2025.11.11 
  (:require
   [aoc.common :refer [any-word lines parse-input spy]]
   [blancas.kern.core :refer [<$> <*> << sep-by space sym*]]
   [clojure.set :as set]))

(def t "svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out")

(defn step [devices to [paths complete-paths] filter-fn]
  (let [{next-paths false next-complete true}
        (->> paths
             (mapcat (fn [path]
                       (->> (get devices (last path))
                            (map #(conj path %)))))
             (group-by #(= to (last %))))]
    [next-paths (set/union complete-paths (set (map hash (if (some? filter-fn)
                                                           (filter filter-fn next-complete)
                                                           next-complete))))]))

(defn find-all-paths [devices from to filter-fn]
  (loop [paths #{[from]} complete #{}]
    (let [[next-paths next-complete] (step devices to [paths complete] filter-fn)]
      (if (empty? next-paths)
        next-complete
        (recur next-paths next-complete)))))

(let [devices (parse-input (<$> (partial into {})
                                (lines (<*> (<< (<$> keyword any-word) (sym* \:) space)
                                            (<$> (comp set (partial map keyword)) (sep-by space any-word)))))
                           {:test t :use-test false})]
  
  (->> (find-all-paths devices :you :out nil)
       count
       (println "Part 1:"))
  
  (->> (find-all-paths devices :svr :out #(and (contains? (set %) :dac) (contains? (set %) :fft)))
       count
       (println "Part 2:"))
  )
