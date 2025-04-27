import os
import pandas as pd
import numpy as np
import joblib
import sys
from datetime import datetime
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, silhouette_score, classification_report
from sklearn.preprocessing import StandardScaler, LabelEncoder
import sqlite3

# Import the report generator
from model_report_generator import ModelReportGenerator

# Import data preprocessing functions
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    from data_preprocessing import load_datasets, process_and_save_data
except ImportError:
    print("Error: Could not import data_preprocessing.")
    print("Make sure data_preprocessing.py is in the current directory or in your Python path.")
    sys.exit(1)

def load_data():
    """
    Load and combine data from CSV files and SQLite database
    """
    # Load recipes from CSV
    recipes_df = pd.read_csv('data/recipes.csv')
    
    # Load user data
    users_df = pd.read_csv('data/user_data.csv')
    
    # Load additional recipes from SQLite database
    try:
        conn = sqlite3.connect('data/recipes_second.db')
        recipes_db_df = pd.read_sql_query("SELECT * FROM recipes", conn)
        conn.close()
        
        # Combine recipe data
        recipes_df = pd.concat([recipes_df, recipes_db_df], ignore_index=True)
        recipes_df = recipes_df.drop_duplicates(subset=['recipe_id'])
    except (sqlite3.Error, FileNotFoundError) as e:
        print(f"Warning: Could not load recipes from database: {str(e)}")
    
    return recipes_df, users_df

def preprocess_data(recipes_df, users_df):
    """
    Preprocess the data for model training
    """
    # Process recipe features
    recipe_features = ['protein', 'carbs', 'fat', 'calories', 'sodium', 'fiber']
    recipe_categorical = ['meal_type', 'diet_type', 'cooking_difficulty']
    
    # Create binary features for dietary restrictions
    dietary_features = ['vegetarian', 'vegan', 'gluten_free', 'diabetes_friendly', 
                       'heart_healthy', 'low_sodium']
    
    # Process user features
    user_numerical = ['Height', 'Weight', 'Exercise Frequency', 'Exercise Duration',
                     'Daily Steps Count', 'Sleep Duration', 'Water Intake']
    
    user_categorical = ['BMI Category', 'Diet Type', 'Meal Size Preference',
                       'Spice Tolerance', 'Cuisine Preferences']
    
    # Create feature matrices
    X_recipes = recipes_df[recipe_features + dietary_features].copy()
    X_users = users_df[user_numerical].copy()
    
    # Handle categorical variables
    le = LabelEncoder()
    for col in recipe_categorical:
        X_recipes[col] = le.fit_transform(recipes_df[col])
    
    for col in user_categorical:
        X_users[col] = le.fit_transform(users_df[col])
    
    # Scale numerical features
    scaler = StandardScaler()
    X_recipes[recipe_features] = scaler.fit_transform(X_recipes[recipe_features])
    X_users[user_numerical] = scaler.fit_transform(X_users[user_numerical])
    
    return X_recipes, X_users, recipes_df, users_df

def train_clustering_model(X, n_clusters=5, random_state=42):
    """
    Train a clustering model on the data
    """
    kmeans = KMeans(n_clusters=n_clusters, random_state=random_state)
    clusters = kmeans.fit_predict(X)
    
    # Calculate silhouette score
    silhouette_avg = silhouette_score(X, clusters)
    
    return kmeans, clusters, silhouette_avg

def train_classification_model(X, y, test_size=0.2, random_state=42):
    """
    Train a classification model
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    clf = RandomForestClassifier(n_estimators=100, random_state=random_state)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    report = classification_report(y_test, y_pred)
    
    return clf, report

def main():
    # Create output directory
    os.makedirs('models', exist_ok=True)
    os.makedirs('reports', exist_ok=True)
    
    # Load data
    print("Loading data...")
    recipes_df, users_df = load_data()
    
    # Preprocess data
    print("Preprocessing data...")
    X_recipes, X_users, recipes_df, users_df = preprocess_data(recipes_df, users_df)
    
    # Train recipe clustering model
    print("Training recipe clustering model...")
    recipe_kmeans, recipe_clusters, recipe_silhouette = train_clustering_model(X_recipes)
    
    # Save recipe clustering results
    recipes_df['cluster'] = recipe_clusters
    recipes_df.to_csv('reports/recipe_clusters.csv', index=False)
    
    # Train user clustering model
    print("Training user clustering model...")
    user_kmeans, user_clusters, user_silhouette = train_clustering_model(X_users)
    
    # Save user clustering results
    users_df['cluster'] = user_clusters
    users_df.to_csv('reports/user_clusters.csv', index=False)
    
    # Train classification model for meal type prediction
    print("Training meal type classification model...")
    X_meal = X_recipes.copy()
    y_meal = recipes_df['meal_type']
    meal_clf, meal_report = train_classification_model(X_meal, y_meal)
    
    # Save models and reports
    joblib.dump(recipe_kmeans, 'models/recipe_clustering_model.pkl')
    joblib.dump(user_kmeans, 'models/user_clustering_model.pkl')
    joblib.dump(meal_clf, 'models/meal_classification_model.pkl')
    
    with open('reports/clustering_report.txt', 'w') as f:
        f.write(f"Recipe Clustering Silhouette Score: {recipe_silhouette:.3f}\n")
        f.write(f"User Clustering Silhouette Score: {user_silhouette:.3f}\n")
    
    with open('reports/classification_report.txt', 'w') as f:
        f.write("Meal Type Classification Report:\n")
        f.write(meal_report)
    
    print("Training completed! Models and reports saved.")

if __name__ == "__main__":
    main() 