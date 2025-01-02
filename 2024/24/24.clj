(ns aoc.2024.24.24
  (:require
   [aoc.common :refer [lines parse-input spy]]
   [blancas.kern.core :refer [<$> <*> << <|> >> alpha-num dec-num many
                              many-till new-line* space token*]]
   [clojure.string :as str]))

(defn bin->dec [bin]
  (->> bin
       reverse
       (concat ["2r"])
       (apply str)
       read-string))

(defn dec->binstr [dec]
  (->> (Long/toString dec 2)
       (map #(parse-long (str %)))
       reverse
       (apply str)))

(defn dec->bin [dec]
  (as-> (dec->binstr dec) v
    (str/split v #"")
    (map parse-long v)))

(def ops {"AND" (fn [GET a b]
                  (if (and (= 1 (GET a)) (= 1 (GET b))) 1 0))
          "OR" (fn [GET a b]
                 (if (or (= 1 (GET a)) (= 1 (GET b))) 1 0))
          "XOR" (fn [GET a b]
                  (if (and (or (= 1 (GET a)) (= 1 (GET b)))
                           (not (and (= 1 (GET a)) (= 1 (GET b))))) 1 0))})

(defn op [GET [o a b]] ((get ops o) GET a b))

(defn get-output [inputs conns]
  #_{:clj-kondo/ignore [:inline-def]}
  (def GET (memoize
            (fn [w] (or (get inputs w)
                        (op GET (get conns w))))))
  (->> (keys conns)
       (filter #(str/starts-with? % "z"))
       sort
       (map GET)
       (apply str)))

(defn get-input-num [inputs which]
  (->> inputs
       (filter (fn [[k]] (str/starts-with? k which)))
       sort
       (map last)
       (apply str)))

(defn test-add [conns a b]
  (let [inputs (->> (range 45) (mapcat #(vector [(format "x%02d" %) 0] [(format "y%02d" %) 0])) (into {}))
        inputs (->> (dec->bin a)
                    (map-indexed vector)
                    (reduce (fn [inp [i v]] (assoc inp (format "x%02d" i) v)) inputs))
        inputs (->> (dec->bin b)
                    (map-indexed vector)
                    (reduce (fn [inp [i v]] (assoc inp (format "y%02d" i) v)) inputs))]
    (try
      (let [x (get-input-num inputs "x")
            y (get-input-num inputs "y")
            z (get-output inputs conns)]
        (= (spy (bin->dec (spy z)))
           (+ (bin->dec (spy x)) (bin->dec (spy y)))))
      (catch StackOverflowError _ false))))

(defn print-tree [conns which depth]
  (if-let [[o a b] (get conns which)]
    (do
      (println (apply str (take (* depth 2) (repeat " "))) which o)
      (print-tree conns a (inc depth))
      (print-tree conns b (inc depth)))
    (println (apply str (take (* depth 2) (repeat " "))) which)))

(defn get-depth
  ([conns which] (get-depth conns which 0))
  ([conns which depth]
   (if-let [[_ a b] (get conns which)]
     (max (get-depth conns a (inc depth))
          (get-depth conns b (inc depth)))
     depth)))

(defn swap [conns a b]
  (-> conns
      (assoc a (get conns b))
      (assoc b (get conns a))))

(def wire (<$> (partial apply str) (many alpha-num)))
(let [[inputs conns]
      (parse-input (<*> (<$> (partial into {}) (many-till (<< (<*> wire (>> (token* ": ") dec-num)) new-line*) new-line*))
                        (<$> #(->> % (map (fn [[i1 op i2 out]] [out [op i1 i2]])) (into {}))
                             (lines (<*> wire (>> space (apply <|> (map token* ["AND" "OR" "XOR"])))
                                         (>> space wire) (>> (token* " -> ") wire))))))
      all-wires (set (keys conns))
      output-wires (->> all-wires
                        (filter #(str/starts-with? % "z"))
                        sort)
      z (get-output inputs conns)

      conns (-> conns
                (swap "z07" "gmt")
                (swap "z18" "dmn")
                (swap "cbj" "qjj")
                (swap "cfk" "z35"))]

  (println "Part 1:" (bin->dec z))

  ;; (->> output-wires
  ;;      (map #(vector % (get-depth conns %))))

  ;; (print-tree conns "z05" 0)
  ;; (print-tree conns "z06" 0)
  ;; (print-tree conns "z07" 0)
  ;; (print-tree conns "z11" 0)
  ;; (print-tree conns "z35" 0)

  ;; (test-add conns 30000000000 200000000000)
  )

(->> ["z07" "gmt"
      "z18" "dmn"
      "cbj" "qjj"
      "cfk" "z35"]
     sort
     (str/join ",")
     (println "Part 2:"))