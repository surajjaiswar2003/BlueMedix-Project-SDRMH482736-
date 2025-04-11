# diet_model.py - Updated version
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, silhouette_score
from sklearn.model_selection import train_test_split, GridSearchCV
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns

# Create directory for models
os.makedirs('models', exist_ok=True)

def load_processed_data():
    """Load the preprocessed data and preprocessor"""
    print("Loading preprocessed data...")
    
    try:
        # Load enhanced user data
        data_path = 'processed_data/enhanced_user_data.csv'
        preprocessor_path = 'processed_data/preprocessor.pkl'
        
        data = pd.read_csv(data_path)
        preprocessor = joblib.load(preprocessor_path)
        
        print(f"Loaded data with {data.shape[0]} records and {data.shape[1]} features")
        
        return data, preprocessor
    
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please run data_preprocessing.py first to generate the required files.")
        return None, None

def preprocess_features(data, preprocessor):
    """Apply the preprocessing pipeline to the data"""
    print("Preprocessing features...")
    
    # Apply the preprocessor to transform the data
    X_transformed = preprocessor.transform(data)
    
    print(f"Transformed data shape: {X_transformed.shape}")
    
    return X_transformed

def train_user_clustering(X, n_clusters=5):
    """Train a KMeans clustering model to group similar users"""
    print(f"Training user clustering with {n_clusters} clusters...")
    
    # Train the clustering model
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    user_clusters = kmeans.fit_predict(X)
    
    # Calculate silhouette score to evaluate clustering quality
    silhouette_avg = silhouette_score(X, user_clusters)
    print(f"Silhouette Score: {silhouette_avg:.4f}")
    
    # Save the clustering model
    joblib.dump(kmeans, 'models/user_clustering_model.pkl')
    
    return kmeans, user_clusters

def analyze_clusters(data, clusters, n_clusters):
    """Analyze the characteristics of each cluster"""
    print("Analyzing clusters...")
    
    # Add cluster labels to the original data
    data_with_clusters = data.copy()
    data_with_clusters['cluster'] = clusters
    
    # Save data with cluster assignments for later use
    data_with_clusters.to_csv('processed_data/data_with_clusters.csv', index=False)
    
    # Create directory for cluster analysis
    os.makedirs('visualizations/clusters', exist_ok=True)
    
    # Calculate cluster statistics for numerical features only
    # First, identify numerical columns
    numerical_cols = data_with_clusters.select_dtypes(include=['number']).columns.tolist()
    numerical_cols = [col for col in numerical_cols if col != 'cluster']  # Exclude cluster column
    
    if numerical_cols:
        cluster_stats = data_with_clusters.groupby('cluster')[numerical_cols].mean()
        print("\nCluster Statistics (mean values):")
        
        # Display only common numerical features if they exist
        common_features = [col for col in ['height', 'weight', 'bmi', 'exercise_frequency', 
                                        'exercise_duration', 'activity_score'] 
                        if col in numerical_cols]
        
        if common_features:
            print(cluster_stats[common_features])
        else:
            print(cluster_stats.head())
    else:
        print("No numerical columns found for cluster statistics")
    
    # Visualize clusters based on key features
    key_features = ['height', 'weight', 'bmi', 'target_weight', 'exercise_frequency', 
                   'exercise_duration', 'activity_score', 'water_intake']
    
    available_key_features = [f for f in key_features if f in data_with_clusters.columns]
    
    for feature in available_key_features:
        if feature in numerical_cols:  # Only plot numerical features
            plt.figure(figsize=(10, 6))
            for i in range(n_clusters):
                cluster_data = data_with_clusters[data_with_clusters['cluster'] == i]
                if len(cluster_data) > 0:  # Check if cluster has data
                    sns.kdeplot(cluster_data[feature], label=f'Cluster {i}')
            
            plt.title(f'Distribution of {feature} across clusters')
            plt.xlabel(feature)
            plt.ylabel('Density')
            plt.legend()
            plt.savefig(f'visualizations/clusters/{feature}_distribution.png')
            plt.close()
    
    # Visualize categorical features distribution across clusters
    categorical_features = ['diet_type', 'meal_size_preference', 'cooking_skills', 'stress_level']
    available_cat_features = [f for f in categorical_features if f in data_with_clusters.columns]
    
    for feature in available_cat_features:
        plt.figure(figsize=(14, 8))
        for i in range(n_clusters):
            plt.subplot(1, n_clusters, i+1)
            cluster_data = data_with_clusters[data_with_clusters['cluster'] == i]
            if len(cluster_data) > 0 and feature in cluster_data.columns:
                value_counts = cluster_data[feature].value_counts(normalize=True)
                if not value_counts.empty:
                    value_counts.plot(kind='bar')
                    plt.title(f'Cluster {i}: {feature}')
                    plt.xticks(rotation=45)
                    plt.ylim(0, 1)
        
        plt.tight_layout()
        plt.savefig(f'visualizations/clusters/{feature}_by_cluster.png')
        plt.close()
    
    return data_with_clusters

def train_diet_classifier(data_with_clusters, target='diet_type'):
    """Train a classifier to predict the most suitable diet type"""
    print(f"Training diet classifier with target: {target}...")
    
    # Check if target column exists
    if target not in data_with_clusters.columns:
        print(f"Error: Target column '{target}' not found in data")
        return None, 0
    
    # Separate features and target
    y = data_with_clusters[target]
    
    # Remove target column and non-feature columns like 'cluster'
    X = data_with_clusters.drop([target, 'cluster'], axis=1, errors='ignore')
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define preprocessor for model input
    preprocessor = joblib.load('processed_data/preprocessor.pkl')
    
    try:
        # Transform the data
        X_train_transformed = preprocessor.transform(X_train)
        X_test_transformed = preprocessor.transform(X_test)
        
        # Train the classifier with hyperparameter tuning
        quick_param_grid = {
            'n_estimators': [100],
            'max_depth': [None, 20],
            'min_samples_split': [2]
        }
        
        grid_search = GridSearchCV(
            RandomForestClassifier(random_state=42),
            quick_param_grid,
            cv=3,
            n_jobs=-1,
            verbose=1
        )
        
        grid_search.fit(X_train_transformed, y_train)
        
        # Get the best model
        best_model = grid_search.best_estimator_
        
        # Evaluate the model
        y_pred = best_model.predict(X_test_transformed)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Diet classifier accuracy: {accuracy:.4f}")
        
        # Save the model
        joblib.dump(best_model, f'models/diet_{target}_classifier.pkl')
        
        # Feature importance analysis
        feature_importances = best_model.feature_importances_
        
        # Try to get feature names
        try:
            feature_names = []
            for name, transformer, features in preprocessor.transformers_:
                if hasattr(transformer, 'get_feature_names_out') and callable(getattr(transformer, 'get_feature_names_out')):
                    # Handle case where transformer returns feature names (like OneHotEncoder)
                    transformed_feature_names = transformer.get_feature_names_out(features).tolist()
                    feature_names.extend(transformed_feature_names)
                else:
                    # Handle case where transformer is just a scaler
                    feature_names.extend(features)
                    
            # Ensure feature_names and feature_importances have compatible lengths
            if len(feature_names) != len(feature_importances):
                print(f"Warning: Feature names count ({len(feature_names)}) doesn't match importances count ({len(feature_importances)})")
                # Use generic feature names if mismatch
                feature_names = [f"Feature {i}" for i in range(len(feature_importances))]
        except Exception as e:
            print(f"Error getting feature names: {e}")
            feature_names = [f"Feature {i}" for i in range(len(feature_importances))]
        
        # Create a DataFrame to sort and visualize feature importances
        feature_importance_df = pd.DataFrame({
            'Feature': feature_names[:len(feature_importances)],
            'Importance': feature_importances
        }).sort_values(by='Importance', ascending=False)
        
        # Plot feature importances (only top 20)
        top_n = min(20, len(feature_importance_df))
        plt.figure(figsize=(12, 8))
        sns.barplot(x='Importance', y='Feature', data=feature_importance_df.head(top_n))
        plt.title(f'Top {top_n} Feature Importances for {target} Prediction')
        plt.tight_layout()
        plt.savefig(f'visualizations/{target}_feature_importance.png')
        plt.close()
        
        return best_model, accuracy
    
    except Exception as e:
        print(f"Error training diet classifier: {e}")
        return None, 0

def create_recipe_recommendation_system(data_with_clusters, recipe_data, health_restrictions_data):
    """
    Create a recommendation system for recipes based on user clusters and health restrictions
    """
    print("Creating recipe recommendation system...")
    
    try:
        # Load recipe data if not provided
        if recipe_data is None:
            try:
                recipe_data = pd.read_csv('data/enhanced_recipes.csv')
                print(f"Loaded {recipe_data.shape[0]} recipes")
            except FileNotFoundError:
                print("Recipe data not found. Creating a sample recipe dataset.")
                # Create sample recipe data
                recipe_data = pd.DataFrame({
                    'recipe_id': range(1, 101),
                    'name': [f'Recipe {i}' for i in range(1, 101)],
                    'meal_type': np.random.choice(['breakfast', 'lunch', 'dinner', 'snack'], 100),
                    'vegetarian': np.random.choice([True, False], 100),
                    'vegan': np.random.choice([True, False], 100),
                    'calories_per_serving': np.random.randint(100, 800, 100),
                    'protein_per_serving': np.random.randint(5, 40, 100),
                    'carbs_per_serving': np.random.randint(10, 100, 100),
                    'fats_per_serving': np.random.randint(5, 30, 100)
                })
        
        # Load health restrictions data if not provided
        if health_restrictions_data is None:
            try:
                health_restrictions_data = pd.read_csv('data/enhanced_health_restrictions.csv')
                print(f"Loaded {health_restrictions_data.shape[0]} health restrictions")
            except FileNotFoundError:
                print("Health restrictions data not found. Using default restrictions.")
                # Create sample health restrictions
                health_restrictions_data = pd.DataFrame({
                    'restriction_id': range(1, 11),
                    'name': ['Diabetes', 'Hypertension', 'Gluten-free', 'Lactose-free', 
                             'Low-sodium', 'Low-fat', 'Low-carb', 'Nut-free', 'Shellfish-free', 'Egg-free'],
                    'description': ['For diabetic patients', 'For hypertension patients', 
                                   'No gluten', 'No lactose', 'Reduced sodium', 'Reduced fat',
                                   'Reduced carbohydrates', 'No nuts', 'No shellfish', 'No eggs']
                })
        
        # Create cluster-to-recipe mappings
        cluster_recipe_mapping = {}
        
        # For each cluster, identify compatible recipes
        for cluster_id in data_with_clusters['cluster'].unique():
            # Get users in this cluster
            cluster_users = data_with_clusters[data_with_clusters['cluster'] == cluster_id]
            
            # Calculate average characteristics of this cluster for numerical columns only
            numerical_cols = cluster_users.select_dtypes(include=['number']).columns.tolist()
            numerical_cols = [col for col in numerical_cols if col != 'cluster']  # Exclude cluster column
            
            if numerical_cols:
                cluster_profile = cluster_users[numerical_cols].mean()
            else:
                cluster_profile = pd.Series()
            
            # Identify common diet type in this cluster
            if 'diet_type' in cluster_users.columns:
                common_diet_type = cluster_users['diet_type'].mode()[0] if not cluster_users['diet_type'].empty else 'Regular'
            else:
                common_diet_type = 'Regular'
            
            print(f"Cluster {cluster_id} common diet type: {common_diet_type}")
            
            # Filter recipes suitable for this cluster
            cluster_recipes = recipe_data.copy()
            
            # Apply diet type filter if applicable columns exist
            if common_diet_type == 'Vegetarian' and 'vegetarian' in cluster_recipes.columns:
                cluster_recipes = cluster_recipes[cluster_recipes['vegetarian'] == True]
            elif common_diet_type == 'Vegan' and 'vegan' in cluster_recipes.columns:
                cluster_recipes = cluster_recipes[cluster_recipes['vegan'] == True]
            
            # Apply calorie filter based on cluster profile
            if 'calories_per_serving' in cluster_recipes.columns:
                # Use simplified formula for daily caloric needs
                avg_caloric_needs = 2000  # Default value
                
                if 'weight' in cluster_profile and 'height' in cluster_profile:
                    # Very simplified formula for daily caloric needs
                    avg_caloric_needs = 10 * cluster_profile.get('weight', 70) + 6.25 * cluster_profile.get('height', 170) - 5 * 35 + 5
                    
                    # Adjust for activity level if available
                    if 'activity_score' in cluster_profile:
                        activity_multiplier = 1.2 + (cluster_profile.get('activity_score', 0) / 100) * 0.4
                        avg_caloric_needs *= activity_multiplier
                
                # Divide by 3 for per-meal calorie target
                meal_calorie_target = avg_caloric_needs / 3
                calorie_margin = meal_calorie_target * 0.2  # 20% margin
                
                print(f"Cluster {cluster_id} meal calorie target: {meal_calorie_target:.2f} ± {calorie_margin:.2f}")
                
                # Filter recipes by calorie range
                cluster_recipes = cluster_recipes[
                    (cluster_recipes['calories_per_serving'] >= meal_calorie_target - calorie_margin) &
                    (cluster_recipes['calories_per_serving'] <= meal_calorie_target + calorie_margin)
                ]
            
            # Store the filtered recipes for this cluster
            cluster_recipe_mapping[cluster_id] = cluster_recipes
            
            print(f"Cluster {cluster_id}: {len(cluster_recipes)} compatible recipes identified")
        
        # Save the cluster-to-recipe mapping
        with open('models/cluster_recipe_mapping.pkl', 'wb') as f:
            joblib.dump(cluster_recipe_mapping, f)
        
        return cluster_recipe_mapping
    
    except Exception as e:
        print(f"Error creating recipe recommendation system: {e}")
        return None

def create_meal_plan_generator(cluster_recipe_mapping, meal_sequencing_data=None):
    """
    Create a function that generates meal plans based on user cluster and health needs
    """
    print("Creating meal plan generator...")
    
    try:
        # Load meal sequencing data if not provided
        if meal_sequencing_data is None:
            try:
                meal_sequencing_data = pd.read_csv('data/meal_sequencing.csv')
                print(f"Loaded meal sequencing data with {meal_sequencing_data.shape[0]} rows")
            except FileNotFoundError:
                print("Meal sequencing data not found. Creating sample data.")
                # Create sample meal sequencing data
                meal_patterns = ['3_meals', '5_meals', '2_meals']
                meal_types = ['breakfast', 'lunch', 'dinner', 'morning_snack', 'afternoon_snack']
                timings = ['7-9 AM', '12-2 PM', '6-8 PM', '10-11 AM', '3-4 PM']
                
                sample_data = []
                for pattern in meal_patterns:
                    if pattern == '3_meals':
                        meals = [meal_types[0], meal_types[1], meal_types[2]]
                        times = [timings[0], timings[1], timings[2]]
                        calories = [0.25, 0.35, 0.4]
                    elif pattern == '5_meals':
                        meals = meal_types
                        times = timings
                        calories = [0.2, 0.3, 0.3, 0.1, 0.1]
                    else:  # 2_meals
                        meals = [meal_types[1], meal_types[2]]
                        times = [timings[1], timings[2]]
                        calories = [0.45, 0.55]
                    
                    for i, meal in enumerate(meals):
                        sample_data.append({
                            'pattern': pattern,
                            'meal_type': meal,
                            'timing': times[i],
                            'calorie_percent': calories[i]
                        })
                
                meal_sequencing_data = pd.DataFrame(sample_data)
        
        # Define a function that will generate meal plans
        def generate_meal_plan(user_data, user_cluster, days=7):
            """
            Generate a personalized meal plan for a specific user
            
            Args:
                user_data: DataFrame with one row containing user parameters
                user_cluster: The cluster ID assigned to this user
                days: Number of days in the meal plan (default: 7 days for a week)
            
            Returns:
                A dictionary containing the meal plan
            """
            meal_plan = {
                'user_id': user_data.get('user_id', 'unknown'),
                'cluster': user_cluster,
                'days': []
            }
            
            # Get recipes compatible with this cluster
            compatible_recipes = cluster_recipe_mapping.get(user_cluster, pd.DataFrame())
            
            if len(compatible_recipes) == 0:
                return {"error": "No compatible recipes found for this user profile"}
            
            # Get user's diet type
            diet_type = user_data.get('diet_type', 'Regular')
            
            # Determine meal pattern (3 meals, 5 meals, etc.) based on diet type or user preference
            meal_pattern = '3_meals'  # Default
            if diet_type == 'Intermittent Fasting':
                meal_pattern = '2_meals'
            elif user_data.get('meal_size_preference') == 'Small frequent meals':
                meal_pattern = '5_meals'
            
            # Get meal sequence from the meal sequencing data
            meal_sequence = meal_sequencing_data[meal_sequencing_data['pattern'] == meal_pattern]
            
            if meal_sequence.empty:
                print(f"Warning: No meal sequence found for pattern {meal_pattern}. Using default 3-meal pattern.")
                meal_sequence = meal_sequencing_data[meal_sequencing_data['pattern'] == '3_meals']
                # If still empty, create a default pattern
                if meal_sequence.empty:
                    meal_sequence = pd.DataFrame([
                        {'meal_type': 'breakfast', 'timing': '7-9 AM', 'calorie_percent': 0.25},
                        {'meal_type': 'lunch', 'timing': '12-2 PM', 'calorie_percent': 0.35},
                        {'meal_type': 'dinner', 'timing': '6-8 PM', 'calorie_percent': 0.4}
                    ])
            
            # Generate meal plan for each day
            for day in range(days):
                daily_plan = {
                    'day': day + 1,
                    'meals': []
                }
                
                # For each meal in the sequence
                for _, meal_row in meal_sequence.iterrows():
                    meal_type = meal_row['meal_type']
                    timing = meal_row['timing']
                    calorie_percent = meal_row['calorie_percent']
                    
                    # Filter recipes appropriate for this meal type if the column exists
                    if 'meal_type' in compatible_recipes.columns:
                        meal_recipes = compatible_recipes[compatible_recipes['meal_type'] == meal_type]
                        
                        if len(meal_recipes) == 0:
                            # Fallback to any recipe if specific meal type isn't available
                            meal_recipes = compatible_recipes
                    else:
                        # If meal_type column doesn't exist, use all recipes
                        meal_recipes = compatible_recipes
                    
                    # Randomly select a recipe
                    if len(meal_recipes) > 0:
                        selected_recipe = meal_recipes.sample(1).iloc[0]
                        
                        meal = {
                            'meal_type': meal_type,
                            'timing': timing,
                            'recipe_id': selected_recipe.get('recipe_id', ''),
                            'recipe_name': selected_recipe.get('name', ''),
                            'calories': selected_recipe.get('calories_per_serving', 0),
                            'proteins': selected_recipe.get('protein_per_serving', 0),
                            'carbs': selected_recipe.get('carbs_per_serving', 0),
                            'fats': selected_recipe.get('fats_per_serving', 0)
                        }
                        
                        daily_plan['meals'].append(meal)
                
                meal_plan['days'].append(daily_plan)
            
            return meal_plan
        
        # Save the generate_meal_plan function
        with open('models/meal_plan_generator.pkl', 'wb') as f:
            joblib.dump(generate_meal_plan, f)
        
        return generate_meal_plan
    
    except Exception as e:
        print(f"Error creating meal plan generator: {e}")
        return None

def main():
    """Main function to execute the entire model building process"""
    print("Starting ML model building for Diet Recommendation System...")
    
    # Load processed data
    data, preprocessor = load_processed_data()
    if data is None or preprocessor is None:
        return
    
    # Apply preprocessing to get features in the right format
    X = preprocess_features(data, preprocessor)
    
    # Train clustering model to group similar users
    n_clusters = 5  # Can be tuned based on silhouette scores
    kmeans, user_clusters = train_user_clustering(X, n_clusters)
    
    # Analyze the clusters
    data_with_clusters = analyze_clusters(data, user_clusters, n_clusters)
    
    # Train diet type classifier
    diet_classifier, diet_accuracy = train_diet_classifier(data_with_clusters, target='diet_type')
    
    # Load recipe and health restriction data
    recipe_data = None
    health_restrictions_data = None
    try:
        recipe_data = pd.read_csv('data/enhanced_recipes.csv')
        health_restrictions_data = pd.read_csv('data/enhanced_health_restrictions.csv')
    except FileNotFoundError as e:
        print(f"Warning: {e}. Using sample data instead.")
    
    # Create recipe recommendation system
    cluster_recipe_mapping = create_recipe_recommendation_system(
        data_with_clusters, recipe_data, health_restrictions_data
    )
    
    # Create meal plan generator
    meal_sequencing_data = None
    try:
        meal_sequencing_data = pd.read_csv('data/meal_sequencing.csv')
    except FileNotFoundError:
        print("Warning: Meal sequencing data not found. Using default patterns.")
    
    meal_plan_generator = create_meal_plan_generator(cluster_recipe_mapping, meal_sequencing_data)
    
    print("\nModel building completed successfully!")
    print("The following models have been saved:")
    print("- User clustering model: models/user_clustering_model.pkl")
    print("- Diet type classifier: models/diet_diet_type_classifier.pkl")
    print("- Cluster-recipe mapping: models/cluster_recipe_mapping.pkl")
    print("- Meal plan generator: models/meal_plan_generator.pkl")

if __name__ == '__main__':
    main()
