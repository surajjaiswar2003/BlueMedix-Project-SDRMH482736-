# data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import os
import matplotlib.pyplot as plt
import seaborn as sns
import sqlite3

# Define paths to your dataset files in the data folder
RECIPES_PATH = 'data/recipes.csv'
RECIPES_DB_PATH = 'data/recipes_second.db'
USER_DATA_PATH = 'data/user_data.csv'

# Create a directory to save processed data
os.makedirs('processed_data', exist_ok=True)

def load_datasets():
    """
    Load all the dataset files and return them as pandas DataFrames.
    This function handles file not found errors gracefully.
    """
    datasets = {}
    
    try:
        datasets['recipes'] = pd.read_csv(RECIPES_PATH)
        print(f"Successfully loaded recipes CSV: {datasets['recipes'].shape[0]} records")
    except FileNotFoundError:
        print(f"Warning: Could not find {RECIPES_PATH}")
        datasets['recipes'] = None
    
    try:
        # Load data from SQLite database
        conn = sqlite3.connect(RECIPES_DB_PATH)
        datasets['recipes_db'] = pd.read_sql_query("SELECT * FROM recipes", conn)
        conn.close()
        print(f"Successfully loaded recipes from DB: {datasets['recipes_db'].shape[0]} records")
    except (FileNotFoundError, sqlite3.Error) as e:
        print(f"Warning: Could not load recipes from DB: {str(e)}")
        datasets['recipes_db'] = None
    
    try:
        datasets['user_data'] = pd.read_csv(USER_DATA_PATH)
        print(f"Successfully loaded user data: {datasets['user_data'].shape[0]} records")
    except FileNotFoundError:
        print(f"Warning: Could not find {USER_DATA_PATH}")
        datasets['user_data'] = None
    
    return datasets

def explore_data(df, name):
    """
    Perform basic exploration of the dataframe
    """
    print(f"\n--- Exploring {name} dataset ---")
    print(f"Shape: {df.shape}")
    print("\nFirst 5 rows:")
    print(df.head())
    print("\nData types:")
    print(df.dtypes)
    print("\nMissing values:")
    print(df.isnull().sum())
    print("\nSummary statistics:")
    print(df.describe())

def identify_parameter_types(users_df):
    """
    Identify numerical and categorical parameters from user data
    """
    numerical_params = []
    categorical_params = []
    boolean_params = []
    
    for column in users_df.columns:
        if users_df[column].dtype == 'bool':
            boolean_params.append(column)
        elif users_df[column].dtype in ['int64', 'float64']:
            numerical_params.append(column)
        else:
            categorical_params.append(column)
    
    print(f"\nNumerical parameters ({len(numerical_params)}): {numerical_params}")
    print(f"\nCategorical parameters ({len(categorical_params)}): {categorical_params}")
    print(f"\nBoolean parameters ({len(boolean_params)}): {boolean_params}")
    
    return numerical_params, categorical_params, boolean_params

def create_preprocessing_pipeline(numerical_params, categorical_params, boolean_params):
    """
    Create a scikit-learn preprocessing pipeline for the data
    """
    # Numerical features pipeline
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Categorical features pipeline
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    # Boolean features pipeline (convert to 0/1)
    boolean_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
    ])
    
    # Combine all transformers
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_params),
            ('cat', categorical_transformer, categorical_params),
            ('bool', boolean_transformer, boolean_params)
        ])
    
    return preprocessor

def create_derived_features(df):
    """
    Create new features based on existing parameters
    """
    # Make a copy to avoid modifying the original dataframe
    df_derived = df.copy()
    
    # Example: Calculate BMI if height and weight exist
    if 'height' in df.columns and 'weight' in df.columns:
        # Convert height to meters if it's in cm
        height_in_meters = df['height'] / 100
        df_derived['bmi'] = df['weight'] / (height_in_meters ** 2)
        print("Created BMI feature")
    
    # Example: Create activity level score
    if 'exercise_frequency' in df.columns and 'exercise_duration' in df.columns:
        df_derived['activity_score'] = df['exercise_frequency'] * df['exercise_duration']
        print("Created activity score feature")
    
    # Example: Health risk score based on conditions
    health_columns = ['diabetes_type', 'hypertension', 'cardiovascular_issues']
    health_exists = all(col in df.columns for col in health_columns)
    
    if health_exists:
        # Initialize risk score
        df_derived['health_risk_score'] = 0
        
        # Add to risk score based on conditions
        if 'diabetes_type' in df.columns:
            df_derived.loc[df['diabetes_type'] == 'type1', 'health_risk_score'] += 3
            df_derived.loc[df['diabetes_type'] == 'type2', 'health_risk_score'] += 2
            df_derived.loc[df['diabetes_type'] == 'prediabetic', 'health_risk_score'] += 1
        
        if 'hypertension' in df.columns:
            df_derived.loc[df['hypertension'] == True, 'health_risk_score'] += 2
        
        if 'cardiovascular_issues' in df.columns:
            df_derived.loc[df['cardiovascular_issues'] == True, 'health_risk_score'] += 2
            
        print("Created health risk score feature")
    
    return df_derived

def visualize_data(df, numerical_params, categorical_params):
    """
    Create basic visualizations of the data
    """
    # Create directory for visualizations
    os.makedirs('visualizations', exist_ok=True)
    
    # Visualize distribution of numerical parameters
    for param in numerical_params[:5]:  # Limit to first 5 to avoid too many plots
        plt.figure(figsize=(10, 6))
        sns.histplot(df[param], kde=True)
        plt.title(f'Distribution of {param}')
        plt.savefig(f'visualizations/{param}_distribution.png')
        plt.close()
    
    # Visualize categorical parameters
    for param in categorical_params[:5]:  # Limit to first 5
        plt.figure(figsize=(10, 6))
        value_counts = df[param].value_counts()
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Distribution of {param}')
        plt.xticks(rotation=45)
        plt.savefig(f'visualizations/{param}_counts.png')
        plt.close()
    
    # Correlation matrix for numerical parameters
    if len(numerical_params) > 1:
        plt.figure(figsize=(12, 10))
        correlation_matrix = df[numerical_params].corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
        plt.title('Correlation Matrix of Numerical Parameters')
        plt.savefig('visualizations/correlation_matrix.png')
        plt.close()

def process_and_save_data(datasets):
    """
    Process the loaded datasets and create enhanced features
    """
    if datasets['user_data'] is None:
        raise ValueError("User data is required for processing")
    
    # Start with user data
    processed_data = datasets['user_data'].copy()
    
    # Identify parameter types
    numerical_params, categorical_params, boolean_params = identify_parameter_types(processed_data)
    
    # Create derived features
    processed_data = create_derived_features(processed_data)
    
    # Create preprocessing pipeline
    preprocessor = create_preprocessing_pipeline(numerical_params, categorical_params, boolean_params)
    
    # Save the preprocessor
    import joblib
    joblib.dump(preprocessor, 'processed_data/preprocessor.pkl')
    
    # Save the processed data
    processed_data.to_csv('processed_data/enhanced_user_data.csv', index=False)
    
    # Create visualizations
    visualize_data(processed_data, numerical_params, categorical_params)
    
    return processed_data

if __name__ == '__main__':
    print("Starting data preprocessing for the Diet Recommendation System...")
    
    # Load all datasets
    datasets = load_datasets()
    
    # Process and save the data
    processed_data = process_and_save_data(datasets)
    
    if processed_data is not None:
        print("\nData preprocessing completed successfully!")
        print(f"Enhanced user data saved to 'processed_data/enhanced_user_data.csv'")
        print(f"Preprocessor saved to 'processed_data/preprocessor.pkl'")
    else:
        print("\nData preprocessing failed!")
