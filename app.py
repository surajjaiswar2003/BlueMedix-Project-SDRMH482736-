# simplified_app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import joblib
import meal_plan_generator

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load ML models
try:
    clustering_model = joblib.load('models/user_clustering_model.pkl')
    preprocessor = joblib.load('processed_data/preprocessor.pkl')
    meal_plan_generator_func = meal_plan_generator.generate_meal_plan
    print("ML models loaded successfully")
except Exception as e:
    print(f"Warning: Could not load ML models: {e}")
    clustering_model = None
    preprocessor = None
    meal_plan_generator_func = None

def predict_user_cluster(user_params):
    """Predict the cluster for a user based on their parameters"""
    if clustering_model is None or preprocessor is None:
        return 0  # Default to cluster 0 if models aren't available
    
    try:
        # Convert user parameters to DataFrame
        user_df = pd.DataFrame([user_params])
        
        # Transform user data
        user_transformed = preprocessor.transform(user_df)
        
        # Predict cluster
        cluster = clustering_model.predict(user_transformed)[0]
        return int(cluster)
    except Exception as e:
        print(f"Error predicting cluster: {e}")
        return 0

# Parameter submission and diet plan generation endpoint
@app.route('/api/generate-diet', methods=['POST'])
def generate_diet_plan():
    # Get parameters from request
    user_params = request.json
    
    if not user_params:
        return jsonify({'error': 'No parameters provided'}), 400
    
    # Predict user cluster
    user_cluster = predict_user_cluster(user_params)
    
    # Generate meal plan
    if meal_plan_generator_func is None:
        return jsonify({'error': 'Meal plan generator not available'}), 500
    
    try:
        meal_plan = meal_plan_generator_func(user_params, user_cluster)
        
        # Check for errors in meal plan
        if isinstance(meal_plan, dict) and 'error' in meal_plan:
            return jsonify({'error': meal_plan['error']}), 500
        
        return jsonify({
            'message': 'Diet plan generated successfully',
            'cluster': user_cluster,
            'plan': meal_plan
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Failed to generate diet plan: {str(e)}'}), 500

# Recipe routes for displaying available recipes
@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    # Optional filtering
    meal_type = request.args.get('meal_type')
    vegetarian = request.args.get('vegetarian')
    vegan = request.args.get('vegan')
    
    try:
        # Try to load from CSV
        recipes = pd.read_csv('data/recipes.csv')
        
        # Apply filters
        if meal_type:
            recipes = recipes[recipes['meal_type'] == meal_type]
        if vegetarian == 'true':
            recipes = recipes[recipes['vegetarian'] == True]
        if vegan == 'true':
            recipes = recipes[recipes['vegan'] == True]
        
        # Convert to JSON
        recipes_json = recipes.to_dict(orient='records')
        return jsonify(recipes_json), 200
    
    except Exception as e:
        return jsonify({'error': f'Failed to load recipes: {str(e)}'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
