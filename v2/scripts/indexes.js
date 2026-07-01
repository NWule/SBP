db.recipes.createIndex({ RecipeId: 1 })
db.recipes.createIndex({ ReviewCount: -1, AggregatedRating: -1 })
db.recipes.createIndex({ KategorijaSastojaka: 1, ReviewCount: 1, AggregatedRating: 1 })

db.reviews.createIndex({ RecipeId: 1 })
db.reviews.createIndex({ AuthorId: 1, DateSubmitted: 1, Rating: 1 })
db.reviews.createIndex({ RecipeId: 1, DateSubmitted: 1, RecipeName: 1, RecipeDatePublished: 1 })