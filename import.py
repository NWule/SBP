from pymongo import MongoClient
import pandas as pd
import re


def parse_r_vector(val):
    if not isinstance(val, str) or not val.strip().startswith('c('):
        return val
    
    return re.findall(r'"((?:[^"\\]|\\.)*)"', val)


list_columns = [
    "Images", "Keywords", "RecipeIngredientQuantities", 
    "RecipeIngredientParts", "RecipeInstructions"
]

mongo_url = "mongodb://localhost:27017/"
db_name = "food_data"
chunk_size = 10000

client = MongoClient(mongo_url)
db = client[db_name]

recipes_collection = db["recipes"]
reviews_collection = db["reviews"]

for chunk in pd.read_csv("./data/recipes.csv", chunksize=chunk_size):
    for col in list_columns:
        if col in chunk.columns:
            chunk[col] = chunk[col].apply(parse_r_vector)
    recipes_col = chunk.where(pd.notnull(chunk), None).to_dict("records")
    if recipes_col:
        recipes_collection.insert_many(recipes_col)

for chunk in pd.read_csv("./data/reviews.csv", chunksize=chunk_size):
    reviews_col = chunk.where(pd.notnull(chunk), None).to_dict("records")
    if reviews_col:
        reviews_collection.insert_many(reviews_col)

client.close()