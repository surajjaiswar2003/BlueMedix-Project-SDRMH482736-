import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydietdiary']
collection = db['recipes']

# Read CSV with specific data types
df = pd.read_csv('ML/data/recipes.csv', dtype={
    'recipe_id': int,
    'name': str,
    'meal_type': str,
    'protein': int,
    'carbs': int,
    'fat': int,
    'calories': int,
    'sodium': int,
    'fiber': int,
    'ingredients': str,
    'instructions': str,
    'vegetarian': bool,
    'vegan': bool,
    'gluten_free': bool,
    'diabetes_friendly': bool,
    'heart_healthy': bool,
    'low_sodium': bool,
    'diet_type': str,
    'cooking_difficulty': str,
    'prep_time': int
})

# Convert boolean columns from 0/1 to True/False
bool_columns = ['vegetarian', 'vegan', 'gluten_free', 
                'diabetes_friendly', 'heart_healthy', 'low_sodium']
for col in bool_columns:
    df[col] = df[col].astype(bool)

# Split ingredients into arrays
df['ingredients'] = df['ingredients'].str.split(',').apply(lambda x: [item.strip() for item in x])

# Convert DataFrame to list of dictionaries
recipes = df.to_dict('records')

# Insert into MongoDB
result = collection.insert_many(recipes)
print(f"{len(recipes)} recipes imported successfully")

# Create indexes for better query performance
collection.create_index([("meal_type", 1)])
collection.create_index([("diet_type", 1)])
collection.create_index([("vegetarian", 1), ("vegan", 1), ("gluten_free", 1)])
collection.create_index([("recipe_id", 1)], unique=True)
collection.create_index([("name", "text"), ("ingredients", "text")])

print("Indexes created successfully")
