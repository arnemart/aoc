(ns aoc.2024.09.9
  (:require
   [aoc.common :refer [parse-input zip]]
   [blancas.kern.core :refer [<$> digit many]]
   [medley.core :refer [find-first]]))

(defn compact-1 [disk]
  (let [empty-spaces (keep-indexed #(when (= \. %2) %1) disk)
        numbers (->> disk (keep-indexed #(when (number? %2) [%1 %2])) reverse)]
    (->> (zip empty-spaces numbers)
         (filter (fn [[empty-idx [num-idx]]] (< empty-idx num-idx)))
         (reduce (fn [disk [empty-idx [num-idx num]]]
                   (assoc disk empty-idx num num-idx \.)) disk))))

(defn compact-2 [disk]
  (->> (keys disk)
       reverse
       (reduce
        (fn [disk id]
          (let [file (get disk id)
                first-free (find-first #(and (< (:id %) (:id file)) (>= (:free %1) (:file file))) (vals disk))]
            (if (some? first-free)
              (-> disk
                  (assoc-in [id :pos] (+ (:pos first-free) (:file first-free) (:filled first-free)))
                  (assoc-in [(:id first-free) :free] (- (:free first-free) (:file file)))
                  (assoc-in [(:id first-free) :filled] (+ (:filled first-free) (:file file))))
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

(let [disk-map (parse-input (many (<$> #(Character/digit % 10) digit)))
      disk-1 (->> disk-map
                  (partition-all 2)
                  (map-indexed (fn [id [file space]]
                                 (concat (repeat file id)
                                         (if space (repeat space \.) []))))
                  (apply concat)
                  vec)

      disk-2 (->> disk-map
                  (partition-all 2)
                  (reduce (fn [{id :id pos :pos sectors :sectors} [file free]]
                            {:id (inc id)
                             :pos (+ pos file (or free 0))
                             :sectors (conj sectors {:id id :file file :free (or free 0) :pos pos :filled 0})})
                          {:id 0
                           :pos 0
                           :sectors []})
                  :sectors
                  (map #(vector (:id %) %))
                  (into (sorted-map)))]
  (->> disk-1
       compact-1
       checksum-1
       (println "Part 1:"))

  (->> disk-2
       compact-2
       checksum-2
       (println "Part 2:")))