(ns aoc.2022.22.22 
  (:require [aoc.common :refer [numeric? read-input sum tee]]
            [clojure.core.match :refer [match]]
            [clojure.string :as str]))

(def dirs {:r [:u :d] :d [:r :l] :l [:d :u] :u [:l :r]})

(defn step-1 [state what]
  (match what
    (n :guard int?) (loop [i 0 y (:y state) x (:x state)]
                      (case (:dir state)
                        :l (let [v (get-in state [:grid y (dec x)])
                                 nx (if (or (= \space v) (nil? v)) (dec (count (get-in state [:grid y]))) (dec x))]
                             (if (or (= i n) (= \# (get-in state [:grid y nx])))
                               (assoc state :x x)
                               (recur (inc i) y nx)))
                        :r (let [v (get-in state [:grid y (inc x)])
                                 nx (if (or (= \space v) (nil? v)) (->> (range) (some #(when (not= \space (get-in state [:grid y %])) %))) (inc x))]
                             (if (or (= i n) (= \# (get-in state [:grid y nx])))
                               (assoc state :x x)
                               (recur (inc i) y nx)))
                        :u (let [v (get-in state [:grid (dec y) x])
                                 ny (if (or (= \space v) (nil? v)) (->> (range (count (:grid state))) reverse (some #(when (not= \space (get-in state [:grid % x])) %))) (dec y))]
                             (if (or (= i n) (= \# (get-in state [:grid ny x])))
                               (assoc state :y y)
                               (recur (inc i) ny x)))
                        :d (let [v (get-in state [:grid (inc y) x])
                                 ny (if (or (= \space v) (nil? v)) (->> (range) (some #(when (not= \space (get-in state [:grid % x])) %))) (inc y))]
                             (if (or (= i n) (= \# (get-in state [:grid ny x])))
                               (assoc state :y y)
                               (recur (inc i) ny x)))))
    "L" (assoc state :dir (get-in dirs [(:dir state) 0]))
    "R" (assoc state :dir (get-in dirs [(:dir state) 1]))))

(defn which-face [y x]
  (cond
    (and (<= 0 y 49) (<= 100 x 149)) 0
    (and (<= 0 y 49) (<= 50 x 99)) 1
    (and (<= 50 y 99) (<= 50 x 99)) 2
    (and (<= 100 y 149) (<= 50 x 99)) 3
    (and (<= 100 y 149) (<= 0 x 49)) 4
    (and (<= 150 y 199) (<= 0 x 49)) 5
    :else -1))

(defn just [n] (fn [_ _] n))
(defn just-y [y _] y)
(defn just-x [_ x] x)
(defn n-y [n] (fn [y _] (- n y)))
(defn y-n [n] (fn [y _] (- y n)))
(defn x-n [n] (fn [_ x] (- x n)))
(defn y+n [n] (fn [y _] (+ y n)))
(defn x+n [n] (fn [_ x] (+ x n)))

(def connections {0 {:r {:where 3 :dir :l :yd (n-y 149) :xd (just 99)}
                     :d {:where 2 :dir :l :yd (x-n 50) :xd (just 99)}
                     :l {:where 1}
                     :u {:where 5 :dir :u :yd (just 199) :xd (x-n 100)}}
                  1 {:r {:where 0}
                     :d {:where 2}
                     :l {:where 4 :dir :r :yd (n-y 149) :xd (just 0)}
                     :u {:where 5 :dir :r :yd (x+n 100) :xd (just 0)}}
                  2 {:r {:where 0 :dir :u :yd (just 49) :xd (y+n 50)}
                     :d {:where 3}
                     :l {:where 4 :dir :d :yd (just 100) :xd (y-n 50)}
                     :u {:where 1}}
                  3 {:r {:where 0 :dir :l :yd (n-y 149) :xd (just 149)}
                     :d {:where 5 :dir :l :yd (x+n 100) :xd (just 49)}
                     :l {:where 4}
                     :u {:where 2}}
                  4 {:r {:where 3}
                     :d {:where 5}
                     :l {:where 1 :dir :r :yd (n-y 149) :xd (just 50)}
                     :u {:where 2 :dir :r :yd (x+n 50) :xd (just 50)}}
                  5 {:r {:where 3 :dir :u :yd (just 149) :xd (y-n 100)}
                     :d {:where 0 :dir :d :yd (just 0) :xd (x+n 100)}
                     :l {:where 1 :dir :d :yd (just 0) :xd (y-n 100)}
                     :u {:where 4}}})

(defn step-2 [state what]
  (match what
    (n :guard int?) (loop [i 0 y (:y state) x (:x state) dir (:dir state) face (:face state)]
                      (let [new-face (not= face (which-face y x))
                            conn (get-in connections [face dir])
                            dir (if new-face (get conn :dir dir) dir)
                            face (if new-face (:where conn) face)
                            ny (if new-face ((get conn :yd just-y) y x) (+ y (get {:r 0 :d 1 :l 0 :u -1} dir)))
                            nx (if new-face ((get conn :xd just-x) y x) (+ x (get {:r 1 :d 0 :l -1 :u 0} dir)))
                            nv (get-in state [:grid ny nx])]
                        (if (or (= i n) (= \# nv))
                          (assoc state :x x :y y :face face :dir dir)
                          (recur (inc i) ny nx dir face))))

    "L" (assoc state :dir (get-in dirs [(:dir state) 0]))
    "R" (assoc state :dir (get-in dirs [(:dir state) 1]))))

(defn solve [path f state]
  (->> path
       (reduce f state)
       (tee [#(* 1000 (inc (:y %)))
             #(* 4 (inc (:x %)))
             #(.indexOf [:r :d :l :u] (:dir %))])
       sum))

(let [[grid path] (->> (read-input :split-with #"\n\n" :test "        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5" :use-test false)
                       (tee [#(str/split-lines (first %))
                             #(->> (last %)
                                   (re-seq #"\d+|[LR]")
                                   (mapv (fn [s] (if (numeric? s) (parse-long s) s))))]))
      x (.indexOf (first grid) ".")
      state {:y 0
             :x x
             :dir :r
             :grid grid
             :face (which-face 0 x)}]

  (println "Part 1:" (solve path step-1 state))
  (println "Part 2:" (solve path step-2 state)))

; 101102
; 107393
; 110370 too low
; 112275
; 129250
; 125395
; 127346
; 162594
; 181826
; 188262
; 196754 too high