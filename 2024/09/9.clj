(ns aoc.2024.09.9
  (:require
   [aoc.common :refer [digit-num parse-input zip]]
   [blancas.kern.core :refer [<$> many]]
   [medley.core :refer [find-first]]
   [flatland.ordered.map :refer [ordered-map]]))

(defn compact-1 [disk]
  (let [empty-spaces (keep-indexed #(when (= \. %2) %1) disk)
        numbers (->> disk (keep-indexed #(when (number? %2) [%1 %2])) reverse)]
    (->> (zip empty-spaces numbers)
         (take-while (fn [[empty-idx [num-idx]]] (< empty-idx num-idx)))
         (reduce (fn [disk [empty-idx [num-idx num]]]
                   (assoc disk empty-idx num num-idx \.)) disk))))

(defn compact-2 [disk]
  (->> (keys disk)
       reverse
       (reduce
        (fn [disk id]
          (let [{id :id file :file} (get disk id)
                free (->> (vals disk) (take id) (find-first #(>= (:free %1) file)))]
            (if (some? free)
              (-> disk
                  (assoc-in [id :pos] (+ (:pos free) (:file free) (:filled free)))
                  (assoc-in [(:id free) :free] (- (:free free) file))
                  (assoc-in [(:id free) :filled] (+ (:filled free) file)))
              disk)))
        disk)))

(defn checksum-1 [disk]
  (->> disk
       (take-while number?)
       (map-indexed *)
       (apply +)))

(defn checksum-2 [disk]
  (->> (vals disk)
       (mapcat (fn [{id :id file :file pos :pos}]
                 (->> (range pos (+ pos file))
                      (map #(* % id)))))
       (apply +)))
(time
 (let [disk-map (parse-input (<$> #(partition-all 2 %) (many digit-num)))
       disk-1 (->> disk-map
                   (map-indexed (fn [id [file space]]
                                  (concat (repeat file id)
                                          (if space (repeat space \.) []))))
                   (apply concat)
                   vec)
       disk-2 (->> disk-map
                   (reduce (fn [{id :id pos :pos blocks :blocks} [file free]]
                             {:id (inc id)
                              :pos (+ pos file (or free 0))
                              :blocks (conj blocks {:id id :file file :free (or free 0) :pos pos :filled 0})})
                           {:id 0 :pos 0 :blocks []})
                   :blocks
                   (map #(vector (:id %) %))
                   (into (ordered-map)))]

   (->> disk-1
        compact-1
        checksum-1
        (println "Part 1:"))

   (->> disk-2
        compact-2
        checksum-2
        (println "Part 2:"))))