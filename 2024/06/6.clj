(ns aoc.2024.06.6
  (:require
   [aoc.common :refer [group-pairs parse-input]]
   [blancas.kern.core :refer [<$> <|> bind get-position many new-line* return sym*]]))

(def delta {\^ [-1 0] \> [0 1] \v [1 0] \< [0 -1]})
(def next-dir {\^ \> \> \v \v \< \< \^})

(defn step [lab w h [y x dir]]
  (let [[dy dx] (get delta dir)
        ny (+ y dy)
        nx (+ x dx)]
    (cond (or (< ny 0) (< nx 0) (> ny h) (> nx w)) nil
          (get-in lab [ny nx]) (step lab w h [y x (get next-dir dir)])
          :else [ny nx dir])))

(defn loops? [w h guard lab]
  (loop [guard guard visited #{}]
    (cond
      (nil? guard) false
      (contains? visited guard) true
      :else (recur (step lab w h guard) (conj visited guard)))))

(let [items (parse-input
             (<$> (partial filter some?)
                  (many (bind [s (<|> (sym* \.) (sym* \#) (sym* \^) new-line*)
                               p get-position]
                              (return (cond (= s \#) [(dec (:line p)) (- (:col p) 2)]
                                            (= s \^) [(dec (:line p)) (- (:col p) 2) s]
                                            :else nil))))))
      guard (->> items
                 (filter #(= 3 (count %)))
                 first)
      lab (->> items
               (filter #(= 2 (count %)))
               group-pairs)
      w (->> items (map #(nth % 1)) (apply max))
      h (->> items (map first) (apply max))
      path (->> (iterate (partial step lab w h) guard)
                (take-while some?)
                (map drop-last)
                set)]

  (println "Part 1:" (count path))

  (->> path
       (filter #(not= (drop-last guard) %))
       (map #(assoc-in lab % true))
       (filter (partial loops? w h guard))
       count
       (println "Part 2:")))