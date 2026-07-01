Analiza zamora korisnika i devijacije sentimenta

```javascript
[
  { $match: { Rating: { $gte: 1 }, DateSubmitted: { $type: "date" } } },
  { $setWindowFields: { partitionBy: "$AuthorId", sortBy: { DateSubmitted: 1 }, output: { PrvaOcena: { $first: "$Rating", window: { documents: ["unbounded", "unbounded"] } }, NedavniProsek: { $avg: "$Rating", window: { documents: [-4, 0] } }, UkupnoRecenzija: { $count: {}, window: { documents: ["unbounded", "current"] } } } } },
  { $match: { UkupnoRecenzija: { $gte: 15 } } },
  { $group: { _id: "$AuthorId", IstorijaRecenzija: { $max: "$UkupnoRecenzija" }, ProsecanZamor: { $avg: { $subtract: ["$PrvaOcena", "$NedavniProsek"] } } } },
  { $match: { ProsecanZamor: { $gt: 1.0 } } },
  { $sort: { ProsecanZamor: -1 } }
]
```

![alt text](<Screenshot (121).png>)

Pronalaženje popularnih sastojaka
```javascript
[
  { $match: { AggregatedRating: { $gte: 4.5 }, ReviewCount: { $gte: 20 } } },
  { $unwind: "$RecipeIngredientParts" },
  { $project: { Sastojak: { $toLower: "$RecipeIngredientParts" } } },
  { $match: { Sastojak: { $nin: ["water", "salt", "pepper", "sugar", "butter"] } } },
  { $group: { _id: "$Sastojak", UcestalostPojavljivanja: { $sum: 1 } } },
  { $sort: { UcestalostPojavljivanja: -1 } },
  { $limit: 15 }
]
```

![alt text](<Screenshot (126).png>)

Ocena recepata u odnosu na različite parametre 
```javascript
[
  { $match: { AggregatedRating: { $gte: 1 }, RecipeInstructions: { $type: "array" }, Calories: { $gte: 0 } } },
  { $project: { Ocena: "$AggregatedRating", SlozenostPripreme: { $cond: { if: { $lte: [{ $size: "$RecipeInstructions" }, 10] }, then: "Brzo (do 10 koraka)", else: "Sporo (preko 10 koraka)" } }, KategorijaKalorija: { $cond: { if: { $lte: ["$Calories", 500] }, then: "Niskokaloricno (do 500 kcal)", else: "Visokokaloricno (preko 500 kcal)" } } } },
  { $group: { _id: { Vreme: "$SlozenostPripreme", Kalorije: "$KategorijaKalorija" }, ProsecnaOcena: { $avg: "$Ocena" }, UkupnoRecepata: { $sum: 1 } } },
  { $sort: { ProsecnaOcena: -1 } }
]
```

![alt text](<Screenshot (124).png>)

Brzina viralnosti recepta (merenje brzine dobijanja n-te recenzije)
```javascript
[
  { $sort: { RecipeId: 1, DateSubmitted: 1 } },
  { $group: { _id: "$RecipeId", DatumiRecenzija: { $push: "$DateSubmitted" }, UkupnoRecenzija: { $sum: 1 }, NazivRecepta: { $first: "$RecipeName" }, DatumObjave: { $first: "$RecipeDatePublished" } } },
  { $match: { UkupnoRecenzija: { $gte: 10 } } },
  { $project: { NazivRecepta: 1, DaniDoViralnosti: { $dateDiff: { startDate: "$DatumObjave", endDate: { $arrayElemAt: ["$DatumiRecenzija", 9] }, unit: "day" } } } },
  { $match: { DaniDoViralnosti: { $gte: 0 } } },
  { $sort: { DaniDoViralnosti: 1 } }
]
```

![alt text](<Screenshot (120).png>)

Odnos količine sastojaka i broja recenzija
```javascript
[
  { $match: { RecipeIngredientParts: { $type: "array" }, ReviewCount: { $gte: 0 } } },
  { $project: { BrojSastojaka: { $size: "$RecipeIngredientParts" }, BrojRecenzija: "$ReviewCount", Ocena: "$AggregatedRating" } },
  { $project: { BrojRecenzija: 1, Ocena: 1, KategorijaSastojaka: { $cond: { if: { $lt: ["$BrojSastojaka", 5] }, then: "1. Broj sastojaka je manji od 5", else: { $cond: { if: { $lt: ["$BrojSastojaka", 10] }, then: "2. Broj sastojaka je izmedju 5 i 9", else: { $cond: { if: { $lt: ["$BrojSastojaka", 15] }, then: "3.Broj sastojaka je izmedju 10 i 14", else: { $cond: { if: { $lt: ["$BrojSastojaka", 20] }, then: "4. Broj sastojaka je izmedju 15 i 19", else: "5. Broj sastojaka je veci od 20" } } } } } } } } },
  { $group: { _id: "$KategorijaSastojaka", UkupnoRecepata: { $sum: 1 }, ProsecanBrojRecenzija: { $avg: "$BrojRecenzija" }, ProsecnaOcena: { $avg: "$Ocena" } } },
  { $sort: { _id: 1 } }
]
```

![alt text](<Screenshot (125).png>)