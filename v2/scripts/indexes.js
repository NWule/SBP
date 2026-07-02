db.recipes.createIndex({ RecipeId: 1 }, { unique: true })
db.recipes.createIndex({ ReviewCount: -1, AggregatedRating: -1 })
db.recipes.createIndex({ KategorijaSastojaka: 1, ReviewCount: 1, AggregatedRating: 1 })
db.recipes.createIndex({ RecipeCategory: 1, SugarContent: -1, RecipeId: 1 });
db.recipes.createIndex({ Name: "text", Calories: 1, ProteinContent: 1, AggregatedRating: 1});
db.recipes.createIndex({ RecipeCategory: 1, AggregatedRating: -1, ProteinContent: -1 });

db.reviews.createIndex({ RecipeId: 1 })
db.reviews.createIndex({ AuthorId: 1, DateSubmitted: 1, Rating: 1 })
db.reviews.createIndex({ RecipeId: 1, DateSubmitted: 1, RecipeName: 1, RecipeDatePublished: 1 })
