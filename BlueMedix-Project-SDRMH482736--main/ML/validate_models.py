import os
import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import LabelEncoder
import sqlite3

def validate_data_loading():
    """Validate that all data files can be loaded correctly"""
    print("\n1. Validating Data Loading...")
    
    # Check recipes.csv
    try:
        recipes_df = pd.read_csv('data/recipes.csv')
        print(f"✓ recipes.csv loaded successfully: {len(recipes_df)} records")
    except Exception as e:
        print(f"✗ Error loading recipes.csv: {str(e)}")
    
    # Check user_data.csv
    try:
        users_df = pd.read_csv('data/user_data.csv')
        print(f"✓ user_data.csv loaded successfully: {len(users_df)} records")
    except Exception as e:
        print(f"✗ Error loading user_data.csv: {str(e)}")
    
    # Check recipes_second.db
    try:
        conn = sqlite3.connect('data/recipes_second.db')
        recipes_db_df = pd.read_sql_query("SELECT * FROM recipes", conn)
        conn.close()
        print(f"✓ recipes_second.db loaded successfully: {len(recipes_db_df)} records")
    except Exception as e:
        print(f"✗ Error loading recipes_second.db: {str(e)}")

def preprocess_features(df, categorical_cols):
    """Helper function to preprocess features including encoding categorical variables"""
    df_processed = df.copy()
    le = LabelEncoder()
    
    for col in categorical_cols:
        if col in df_processed.columns:
            df_processed[col] = le.fit_transform(df_processed[col].astype(str))
    
    return df_processed

def validate_models():
    """Validate that all trained models can be loaded and used"""
    print("\n2. Validating Trained Models...")
    
    # Load data to get correct feature names
    recipes_df = pd.read_csv('data/recipes.csv')
    users_df = pd.read_csv('data/user_data.csv')
    
    # Recipe features
    recipe_numerical = ['protein', 'carbs', 'fat', 'calories', 'sodium', 'fiber']
    recipe_categorical = ['meal_type', 'diet_type', 'cooking_difficulty']
    recipe_boolean = ['vegetarian', 'vegan', 'gluten_free', 'diabetes_friendly', 
                     'heart_healthy', 'low_sodium']
    recipe_features = recipe_numerical + recipe_categorical + recipe_boolean
    
    # User features
    user_numerical = ['Height', 'Weight', 'Exercise Frequency', 'Exercise Duration',
                     'Daily Steps Count', 'Sleep Duration', 'Water Intake']
    user_categorical = ['BMI Category', 'Diet Type', 'Meal Size Preference',
                       'Spice Tolerance', 'Cuisine Preferences']
    user_features = user_numerical + user_categorical
    
    # Preprocess features
    recipes_processed = preprocess_features(recipes_df, recipe_categorical)
    users_processed = preprocess_features(users_df, user_categorical)
    
    # Check recipe clustering model
    try:
        recipe_kmeans = joblib.load('models/recipe_clustering_model.pkl')
        print("✓ Recipe clustering model loaded successfully")
        
        # Test prediction with processed features
        test_data = recipes_processed[recipe_features].iloc[0:5].values
        clusters = recipe_kmeans.predict(test_data)
        print(f"✓ Recipe clustering model can make predictions: {len(clusters)} samples processed")
    except Exception as e:
        print(f"✗ Error with recipe clustering model: {str(e)}")
    
    # Check user clustering model
    try:
        user_kmeans = joblib.load('models/user_clustering_model.pkl')
        print("✓ User clustering model loaded successfully")
        
        # Test prediction with processed features
        test_data = users_processed[user_features].iloc[0:5].values
        clusters = user_kmeans.predict(test_data)
        print(f"✓ User clustering model can make predictions: {len(clusters)} samples processed")
    except Exception as e:
        print(f"✗ Error with user clustering model: {str(e)}")
    
    # Check meal classification model
    try:
        meal_clf = joblib.load('models/meal_classification_model.pkl')
        print("✓ Meal classification model loaded successfully")
        
        # Test prediction with processed features
        test_data = recipes_processed[recipe_features].iloc[0:5].values
        predictions = meal_clf.predict(test_data)
        print(f"✓ Meal classification model can make predictions: {len(predictions)} samples processed")
    except Exception as e:
        print(f"✗ Error with meal classification model: {str(e)}")

def validate_reports():
    """Validate that all reports exist and contain expected information"""
    print("\n3. Validating Reports...")
    
    # Check clustering report
    try:
        with open('reports/clustering_report.txt', 'r') as f:
            content = f.read()
            if 'Recipe Clustering Silhouette Score' in content and 'User Clustering Silhouette Score' in content:
                print("✓ Clustering report exists and contains expected metrics")
            else:
                print("✗ Clustering report missing expected metrics")
    except Exception as e:
        print(f"✗ Error reading clustering report: {str(e)}")
    
    # Check classification report
    try:
        with open('reports/classification_report.txt', 'r') as f:
            content = f.read()
            if 'precision' in content and 'recall' in content and 'f1-score' in content:
                print("✓ Classification report exists and contains expected metrics")
            else:
                print("✗ Classification report missing expected metrics")
    except Exception as e:
        print(f"✗ Error reading classification report: {str(e)}")
    
    # Check clustering results
    try:
        recipe_clusters = pd.read_csv('reports/recipe_clusters.csv')
        print(f"✓ Recipe clusters file exists: {len(recipe_clusters)} records")
    except Exception as e:
        print(f"✗ Error reading recipe clusters: {str(e)}")
    
    try:
        user_clusters = pd.read_csv('reports/user_clusters.csv')
        print(f"✓ User clusters file exists: {len(user_clusters)} records")
    except Exception as e:
        print(f"✗ Error reading user clusters: {str(e)}")

def test_end_to_end():
    """Test a complete recipe recommendation flow"""
    print("\n4. Testing End-to-End Recipe Recommendation...")
    
    try:
        # Load models
        recipe_kmeans = joblib.load('models/recipe_clustering_model.pkl')
        user_kmeans = joblib.load('models/user_clustering_model.pkl')
        meal_clf = joblib.load('models/meal_classification_model.pkl')
        
        # Load data
        recipes_df = pd.read_csv('data/recipes.csv')
        users_df = pd.read_csv('data/user_data.csv')
        
        # Define feature sets
        recipe_numerical = ['protein', 'carbs', 'fat', 'calories', 'sodium', 'fiber']
        recipe_categorical = ['meal_type', 'diet_type', 'cooking_difficulty']
        recipe_boolean = ['vegetarian', 'vegan', 'gluten_free', 'diabetes_friendly', 
                         'heart_healthy', 'low_sodium']
        recipe_features = recipe_numerical + recipe_categorical + recipe_boolean
        
        user_numerical = ['Height', 'Weight', 'Exercise Frequency', 'Exercise Duration',
                         'Daily Steps Count', 'Sleep Duration', 'Water Intake']
        user_categorical = ['BMI Category', 'Diet Type', 'Meal Size Preference',
                          'Spice Tolerance', 'Cuisine Preferences']
        user_features = user_numerical + user_categorical
        
        # Preprocess features
        recipes_processed = preprocess_features(recipes_df, recipe_categorical)
        users_processed = preprocess_features(users_df, user_categorical)
        
        # Create sample user profile
        sample_user = users_processed.iloc[0:1]  # Take first user as example
        
        # Create sample recipe features
        sample_recipe = recipes_processed.iloc[0:1]  # Take first recipe as example
        
        # Get user cluster
        user_cluster = user_kmeans.predict(sample_user[user_features].values)[0]
        
        # Get recipe cluster
        recipe_cluster = recipe_kmeans.predict(sample_recipe[recipe_features].values)[0]
        
        # Predict meal type
        meal_type = meal_clf.predict(sample_recipe[recipe_features].values)[0]
        
        print("✓ Successfully completed end-to-end test:")
        print(f"  - User cluster: {user_cluster}")
        print(f"  - Recipe cluster: {recipe_cluster}")
        print(f"  - Predicted meal type: {meal_type}")
        
    except Exception as e:
        print(f"✗ Error in end-to-end test: {str(e)}")

def main():
    print("Starting Model Validation...")
    
    # Create necessary directories if they don't exist
    os.makedirs('models', exist_ok=True)
    os.makedirs('reports', exist_ok=True)
    
    # Run all validation tests
    validate_data_loading()
    validate_models()
    validate_reports()
    test_end_to_end()
    
    print("\nValidation Complete!")

if __name__ == "__main__":
    main() 