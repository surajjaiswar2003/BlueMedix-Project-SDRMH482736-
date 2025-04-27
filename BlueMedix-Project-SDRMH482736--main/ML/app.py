# ML/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import joblib
import meal_plan_generator
import sys

# Get the absolute path to the ML directory
ML_DIR = os.path.dirname(os.path.abspath(__file__))
# Path to the frontend build directory
FRONTEND_BUILD_DIR = os.path.join(os.path.dirname(ML_DIR), 'frontend', 'dist')

# Initialize Flask app
app = Flask(__name__, static_folder=FRONTEND_BUILD_DIR)
CORS(app)  # Enable CORS for all routes

# Load ML models
try:
    # Use absolute paths to load models
    clustering_model = joblib.load(os.path.join(ML_DIR, 'models/user_clustering_model.pkl'))
    preprocessor = joblib.load(os.path.join(ML_DIR, 'processed_data/preprocessor.pkl'))
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
        # Try to load from CSV with absolute path
        recipes = pd.read_csv(os.path.join(ML_DIR, 'data/recipes.csv'))
        
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

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # If the path is an API endpoint, let the other routes handle it
    if path.startswith('api/'):
        return app.response_class(status=404)
    
    # Check if the requested file exists in the static folder
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    
    # Otherwise, serve the index.html file (for client-side routing)
    return send_from_directory(app.static_folder, 'index.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
