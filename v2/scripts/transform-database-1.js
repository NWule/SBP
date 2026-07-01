db.recipes.updateMany({}, [
  { $set: { KategorijaKalorija: { $cond: { if: { $lte: [{ $toDouble: { $ifNull: ["$Calories", 0] } }, 500] },
   then: "Niskokaloricno (do 500 kcal)", else: "Visokokaloricno (preko 500 kcal)" } }, GotovaSlozenost: { $let: { vars:
     { brojKoraka: { $cond: { if: { $isArray: "$RecipeInstructions" }, then: { $size: "$RecipeInstructions" }, else: 0 } } },
      in: { $cond: { if: { $lte: ["$$brojKoraka", 10] }, then: "Brzo (do 10 koraka)", else: "Sporo (preko 10 koraka)" } } } },
      KategorijaSastojaka: { $let: { vars: { brojSastojaka: { $cond: { if: { $isArray: "$RecipeIngredientParts" }, then: { $size: "$RecipeIngredientParts" }, else: 0 } } }, in:
    { $switch: { branches: [ { case: { $lt: ["$$brojSastojaka", 5] }, then: "1. Broj sastojaka je manji od 5" }, { case: { $lt: ["$$brojSastojaka", 10] }, then: "2. Broj sastojaka je izmedju 5 i 9" }, { case: { $lt: ["$$brojSastojaka", 15] },
    then: "3. Broj sastojaka je izmedju 10 i 14" }, { case: { $lt: ["$$brojSastojaka", 20] }, then: "4. Broj sastojaka je izmedju 15 i 19" } ], default: "5. Broj sastojaka je veci od 20" } } } } } }
])  

db.reviews.aggregate([
  { $lookup: { from: "recipes", localField: "RecipeId", foreignField: "RecipeId", as: "privremeniRecept" } },
  { $set: { RecipeName: { $arrayElemAt: ["$privremeniRecept.Name", 0] }, RecipeDatePublished: { $arrayElemAt: ["$privremeniRecept.DatePublished", 0] } } },
  { $project: { privremeniRecept: 0 } },
  { $merge: { into: "reviews", on: "_id", whenMatched: "merge", whenNotMatched: "insert" } }
], { allowDiskUse: true })