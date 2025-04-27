from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os
from pymongo import MongoClient
import traceback

# Custom transformer class needed for loading the model
class HealthPriorityTransformer:
    def __init__(self, high_cols=None, medium_cols=None, low_cols=None):
        self.high_cols = high_cols or []
        self.medium_cols = medium_cols or []
        self.low_cols = low_cols or []
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/mydietdiary"
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database()  # This will use the database name from the URI
    recipes_collection = db.recipes  # Collection name matches your MongoDB collection
    
    # Verify connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

# Function to fetch recipes from MongoDB
def fetch_recipes_from_mongodb():
    try:
        # Fetch all recipes from MongoDB
        recipes = list(recipes_collection.find({}))
        
        # Convert MongoDB _id to string to make it JSON serializable
        for recipe in recipes:
            if '_id' in recipe:
                recipe['_id'] = str(recipe['_id'])
        
        # Convert to DataFrame for compatibility with existing code
        recipes_df = pd.DataFrame(recipes)
        print(f"Fetched {len(recipes_df)} recipes from MongoDB")
        return recipes_df
    except Exception as e:
        print(f"Error fetching recipes from MongoDB: {e}")
        return pd.DataFrame()  # Return empty DataFrame on error

# Function to load all required models
def load_models():
    models = {}
    try:
        # Load clustering model
        with open('models/kmeans_model.pkl', 'rb') as f:
            models['kmeans_model'] = pickle.load(f)
        
        # Load PCA transformation
        with open('models/pca.pkl', 'rb') as f:
            models['pca'] = pickle.load(f)
        
        # Load Random Forest model
        with open('models/rf_model.pkl', 'rb') as f:
            models['rf_model'] = pickle.load(f)
        
        # Load preprocessing pipeline
        with open('models/preprocessing_pipeline.pkl', 'rb') as f:
            models['preprocessing_pipeline'] = pickle.load(f)
        
        # Load cluster analysis
        with open('models/cluster_analysis.pkl', 'rb') as f:
            models['cluster_analysis'] = pickle.load(f)
        
        # Load categorical columns
        with open('models/categorical_cols.pkl', 'rb') as f:
            models['categorical_cols'] = pickle.load(f)
        
        print("All models loaded successfully!")
        return models
    except Exception as e:
        print(f"Error loading models: {e}")
        return None

# Load models at startup
models = load_models()

# Diet plan generation function
def generate_diet_plan(user_params, kmeans_model, pca, rf_model, cluster_analysis, days=7):
    # Fetch recipes from MongoDB instead of loading from CSV
    recipes_df = fetch_recipes_from_mongodb()
    
    if recipes_df.empty:
        raise Exception("Failed to fetch recipes from database")
    
    # Create DataFrame with user parameters
    user_df = pd.DataFrame([user_params])
    
    # Fill NaN values in object columns
    for col in user_df.select_dtypes(include=['object']).columns:
        user_df[col] = user_df[col].fillna('Unknown')
    
    # Ensure all categorical columns are string type
    for col in user_df.select_dtypes(include=['object']).columns:
        user_df[col] = user_df[col].astype(str)
    
    # Ensure all expected columns exist
    categorical_cols = models['categorical_cols']
    for col in categorical_cols:
        if col not in user_df.columns:
            user_df[col] = 'Unknown'
    
    # Preprocess user parameters
    user_features = models['preprocessing_pipeline'].transform(user_df)
    
    # Apply PCA reduction
    user_reduced = pca.transform(user_features)
    
    # Assign user to a cluster
    user_cluster = kmeans_model.predict(user_reduced)[0]
    cluster_profile = cluster_analysis.loc[user_cluster]
    
    # Find suitable recipes
    suitable_recipes = []
    diet_type = user_params.get('Diet Type', 'Non-spicy')
    
    for _, recipe in recipes_df.iterrows():
        # Create features for prediction
        recipe_features = recipe[['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber']].values
        features_with_cluster = np.append(recipe_features, user_cluster)
        
        # Predict suitability
        suitability = rf_model.predict([features_with_cluster])[0]
        
        # Check dietary preferences
        diet_suitable = True
        recipe_name = recipe['name'].lower() if 'name' in recipe and isinstance(recipe['name'], str) else ""
        
        # Handle ingredients based on MongoDB format (could be a list or string)
        if 'ingredients' in recipe:
            if isinstance(recipe['ingredients'], list):
                recipe_ingredients = ' '.join(recipe['ingredients']).lower()
            else:
                recipe_ingredients = str(recipe['ingredients']).lower()
        else:
            recipe_ingredients = ""
        
        # Vegetarian check
        if diet_type == 'Vegetarian':
            non_veg_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                  'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'cod', 'tilapia']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_veg_ingredients):
                diet_suitable = False
                
        # Vegan check
        elif diet_type == 'Vegan':
            non_vegan_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                    'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'milk', 'cheese',
                                    'yogurt', 'cream', 'butter', 'egg', 'honey', 'dairy']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_vegan_ingredients):
                diet_suitable = False
                
        # Pescatarian check
        elif diet_type == 'Pescatarian':
            non_pescatarian_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'meat', 'bacon', 'ham', 'sausage']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_pescatarian_ingredients):
                diet_suitable = False
        
        # Add suitable recipes
        if suitability == 1 and diet_suitable:
            suitable_recipes.append(recipe)
    
    # Create meal plan based on preference
    meal_plan = {}
    meal_preference = user_params.get('Meal Size Preference', 'Regular 3 meals')
    
    if meal_preference == 'Small frequent':
        meal_types = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner']
    elif meal_preference == 'Regular 3 meals':
        meal_types = ['Breakfast', 'Lunch', 'Dinner']
    else:  # Large infrequent
        meal_types = ['Brunch', 'Dinner']
    
    # Set calorie targets based on BMI
    bmi_category = user_params.get('BMI Category', 'Normal')
    if bmi_category == 'Underweight':
        daily_calorie_target = 2500
    elif bmi_category == 'Normal':
        daily_calorie_target = 2000
    elif bmi_category == 'Overweight':
        daily_calorie_target = 1800
    else:  # Obese
        daily_calorie_target = 1500
    
    # Track used recipes
    used_recipes = set()
    
    # Generate plan for each day
    for day in range(1, days+1):
        meal_plan[f'Day {day}'] = {}
        
        for meal_type in meal_types:
            # Filter recipes for meal time
            if 'Breakfast' in meal_type or 'Morning' in meal_type or 'Brunch' in meal_type:
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'breakfast']
            elif 'Lunch' in meal_type or 'Afternoon' in meal_type:
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'lunch']
            else:  # Dinner
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'dinner']
            
            # Prioritize unused recipes
            unused_recipes = [r for r in meal_recipes if r['name'] not in used_recipes]
            if not unused_recipes and meal_recipes:
                unused_recipes = meal_recipes
            
            # Select recipe
            if unused_recipes:
                import random
                selected_recipe = random.choice(unused_recipes)
                used_recipes.add(selected_recipe['name'])
                
                meal_plan[f'Day {day}'][meal_type] = {
                    'name': selected_recipe['name'],
                    'calories': float(selected_recipe['calories']),
                    'protein': float(selected_recipe['protein']),
                    'carbs': float(selected_recipe['carbs']),
                    'fat': float(selected_recipe['fat']),
                    'sodium': float(selected_recipe['sodium']),
                    'fiber': float(selected_recipe['fiber']),
                    'ingredients': selected_recipe['ingredients'],  # Include ingredients
                    'instructions': selected_recipe['instructions'] if 'instructions' in selected_recipe else ""  # Include instructions
                }
            else:
                meal_plan[f'Day {day}'][meal_type] = "No suitable recipe found"
    
    # Analyze nutritional content
    nutritional_analysis = analyze_meal_plan(meal_plan)
    
    return meal_plan, user_cluster, nutritional_analysis

def analyze_meal_plan(meal_plan):
    # Calculate daily nutrition
    daily_nutrition = []
    
    for day, meals in meal_plan.items():
        day_nutrition = {
            'calories': 0, 'protein': 0, 'carbs': 0, 
            'fat': 0, 'sodium': 0, 'fiber': 0
        }
        
        for meal_type, meal in meals.items():
            if isinstance(meal, dict):
                day_nutrition['calories'] += meal.get('calories', 0)
                day_nutrition['protein'] += meal.get('protein', 0)
                day_nutrition['carbs'] += meal.get('carbs', 0)
                day_nutrition['fat'] += meal.get('fat', 0)
                day_nutrition['sodium'] += meal.get('sodium', 0)
                day_nutrition['fiber'] += meal.get('fiber', 0)
        
        daily_nutrition.append(day_nutrition)
    
    # Calculate averages
    avg_nutrition = {
        'calories': float(np.mean([day['calories'] for day in daily_nutrition])),
        'protein': float(np.mean([day['protein'] for day in daily_nutrition])),
        'carbs': float(np.mean([day['carbs'] for day in daily_nutrition])),
        'fat': float(np.mean([day['fat'] for day in daily_nutrition])),
        'sodium': float(np.mean([day['sodium'] for day in daily_nutrition])),
        'fiber': float(np.mean([day['fiber'] for day in daily_nutrition]))
    }
    
    # Calculate macronutrient percentages
    total_calories = avg_nutrition['protein'] * 4 + avg_nutrition['carbs'] * 4 + avg_nutrition['fat'] * 9
    
    if total_calories > 0:
        macro_percentages = {
            'protein_pct': float((avg_nutrition['protein'] * 4 / total_calories * 100)),
            'carbs_pct': float((avg_nutrition['carbs'] * 4 / total_calories * 100)),
            'fat_pct': float((avg_nutrition['fat'] * 9 / total_calories * 100))
        }
    else:
        macro_percentages = {'protein_pct': 0, 'carbs_pct': 0, 'fat_pct': 0}
    
    # Calculate variety metrics
    all_recipes = []
    for day, meals in meal_plan.items():
        for meal_type, meal in meals.items():
            if isinstance(meal, dict) and 'name' in meal:
                all_recipes.append(meal['name'])
    
    variety_metrics = {
        'unique_recipes': len(set(all_recipes)),
        'total_meals': len(all_recipes),
        'variety_score': float(len(set(all_recipes)) / len(all_recipes) * 100 if all_recipes else 0)
    }
    
    # Calculate meal coverage
    total_meals = sum(1 for day in meal_plan.values() for meal in day.values())
    suitable_meals = sum(1 for day in meal_plan.values() for meal in day.values() if isinstance(meal, dict))
    meal_coverage = float((suitable_meals / total_meals * 100) if total_meals > 0 else 0)
    
    return {
        'avg_nutrition': avg_nutrition,
        'macro_percentages': macro_percentages,
        'variety_metrics': variety_metrics,
        'meal_coverage': meal_coverage
    }

# Simple test route
@app.route('/test', methods=['GET'])
def test_route():
    print("Test route accessed!")
    return jsonify({"message": "Test route works!"})

# API endpoint for diet plan generation
@app.route('/api/generate_diet_plan', methods=['POST'])
def generate_diet_plan_api():
    print("Diet plan route accessed!")
    try:
        # Get user parameters
        user_params = request.json
        print(f"Received parameters: {user_params}")
        
        # Check if models are loaded
        if not models:
            return jsonify({
                'success': False,
                'error': "ML models not loaded"
            }), 500
        
        # Generate diet plan using MongoDB recipes
        diet_plan, user_cluster, nutritional_analysis = generate_diet_plan(
            user_params, 
            models['kmeans_model'], 
            models['pca'], 
            models['rf_model'],
            models['cluster_analysis']
        )
        
        # Return results
        return jsonify({
            'success': True,
            'diet_plan': diet_plan,
            'user_cluster': int(user_cluster),
            'nutritional_analysis': nutritional_analysis
        })
    
    except Exception as e:
        import traceback
        print(f"Error generating diet plan: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Main entry point
if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Registered routes: {[str(rule) for rule in app.url_map.iter_rules()]}")
    app.run(debug=True, host='0.0.0.0', port=5001)
