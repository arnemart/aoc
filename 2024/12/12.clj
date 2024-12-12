(ns aoc.2024.12.12
  (:require
   [aoc.common :refer [++ find-index lines parse-input]]
   [blancas.kern.core :refer [letter many]]
   [clojure.math.combinatorics :refer [cartesian-product]]
   [clojure.set :as set]))

(defn horiz [p]
  #{(++ p [0 -1]) (++ p [0 1])})

(defn verti [p]
  #{(++ p [-1 0]) (++ p [1 0])})

(defn around [p]
  (set/union (horiz p) (verti p)))

(defn around-many [ps]
  (->> ps
       (map around)
       (apply set/union)))

(defn merge-plots [plots plot]
  (if-let [existing-plot-idx
           (->> plots
                (find-index
                 (fn [_ {t :t ps :ps}]
                   (and (= t (:t plot))
                        (not-empty (set/intersection (around-many (:ps plot)) ps))))))]
    (update-in plots [existing-plot-idx :ps] set/union (:ps plot))
    (conj plots plot)))

(defn find-plots [grid]
  (->> (cartesian-product (range (count grid)) (range (count (first grid))))
       (reduce #(merge-plots %1 {:t (get-in grid %2) :ps #{%2}}) [])
       (reduce merge-plots [])
       (reduce merge-plots [])))

(defn fence-cost-1 [plots]
  (->> plots
       (map (fn [{ps :ps}]
              (* (count ps)
                 (->> ps
                      (mapcat around)
                      (filter #(not (contains? ps %)))
                      count))))
       (apply +)))

(defn around-dir [p]
  [[(++ p [1 0]) :d] [(++ p [-1 0]) :u] [(++ p [0 1]) :r] [(++ p [0 -1]) :l]])

(defn add-point [ps fences p]
  (->> (around-dir p)
       (filter #(not (contains? ps (first %))))
       (reduce (fn [fences [fp dir]]
                 (let [fns ((case dir (:u :d) horiz (:r :l) verti) fp)]
                   (if-let [existing-fence-index
                            (find-index #(and (= (:dir %2) dir)
                                              (> (count (set/intersection (:fps %2) fns)) 0)) fences)]
                     (update-in fences [existing-fence-index :fps] conj fp)
                     (conj fences {:dir dir :fps #{fp}})))) fences)))

(defn find-fences [ps]
  (->> ps
       (sort (fn [a b]
               (compare (vec a) (vec b))))
       (reduce (partial add-point ps) [])
       count))

(defn fence-cost-2 [plots]
  (->> plots
       (map (fn [plot]
              (* (count (:ps plot))
                 (find-fences (:ps plot)))))
       (apply +)))

(let [grid (parse-input (lines (many letter)))
      plots (find-plots grid)]

  (println "Part 1:" (fence-cost-1 plots))
  (println "Part 2:" (fence-cost-2 plots)))