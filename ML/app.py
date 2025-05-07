from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os
from pymongo import MongoClient
import traceback
from werkzeug.utils import secure_filename

# --- Custom transformer class needed for loading the model ---
class HealthPriorityTransformer:
    def __init__(self, high_cols=None, medium_cols=None, low_cols=None):
        self.high_cols = high_cols or []
        self.medium_cols = medium_cols or []
        self.low_cols = low_cols or []
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        return X

# --- Flask app setup ---
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- File upload config ---
UPLOAD_FOLDER = 'data'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload_csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        # Optionally, log to MongoDB
        db.uploads.insert_one({
            'filename': filename,
            'path': save_path,
            'uploaded_at': pd.Timestamp.now()
        })
        return jsonify({'success': True, 'filename': filename})
    return jsonify({'success': False, 'error': 'Invalid file type'}), 400

# --- MongoDB connection ---
MONGO_URI = "mongodb://localhost:27017/mydietdiary"
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database()  # Uses the database name from the URI
    recipes_collection = db.recipes
    # Verify connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

# --- Fetch recipes from MongoDB ---
def fetch_recipes_from_mongodb():
    try:
        recipes = list(recipes_collection.find({}))
        for recipe in recipes:
            if '_id' in recipe:
                recipe['_id'] = str(recipe['_id'])
        recipes_df = pd.DataFrame(recipes)
        print(f"Fetched {len(recipes_df)} recipes from MongoDB")
        return recipes_df
    except Exception as e:
        print(f"Error fetching recipes from MongoDB: {e}")
        return pd.DataFrame()

# --- Load all required models ---
def load_models():
    models = {}
    try:
        with open('models/kmeans_model.pkl', 'rb') as f:
            models['kmeans_model'] = pickle.load(f)
        with open('models/pca.pkl', 'rb') as f:
            models['pca'] = pickle.load(f)
        with open('models/rf_model.pkl', 'rb') as f:
            models['rf_model'] = pickle.load(f)
        with open('models/preprocessing_pipeline.pkl', 'rb') as f:
            models['preprocessing_pipeline'] = pickle.load(f)
        with open('models/cluster_analysis.pkl', 'rb') as f:
            models['cluster_analysis'] = pickle.load(f)
        with open('models/categorical_cols.pkl', 'rb') as f:
            models['categorical_cols'] = pickle.load(f)
        print("All models loaded successfully!")
        return models
    except Exception as e:
        print(f"Error loading models: {e}")
        return None

models = load_models()

# --- Retraining pipeline function ---
def retrain_pipeline(train_user_params_df, recipes_df):
    import pickle
    import numpy as np
    import pandas as pd
    from sklearn.preprocessing import StandardScaler, OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.decomposition import PCA
    from sklearn.cluster import KMeans
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split, RandomizedSearchCV
    from sklearn.metrics import silhouette_score, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

    # 1. Handle missing values
    health_cols = ['Diabetes', 'Digestive Disorders', 'Food Allergies', 'Food Intolerances']
    for col in health_cols:
        train_user_params_df[col] = train_user_params_df[col].fillna('None')
    train_user_params_df['Exercise Type'] = train_user_params_df['Exercise Type'].fillna('Unknown')
    train_user_params_df['Alcohol Consumption'] = train_user_params_df['Alcohol Consumption'].fillna('None')
    train_user_params_df['Hypertension'] = train_user_params_df['Hypertension'].fillna('No')
    train_user_params_df['Cardiovascular'] = train_user_params_df['Cardiovascular'].fillna('Absent')

    # 2. Define columns
    high_priority_cols = ['Diabetes', 'Hypertension', 'Cardiovascular', 'Digestive Disorders', 'Food Allergies']
    medium_priority_cols = ['BMI Category', 'Weight (kg)', 'Target Weight (kg)']
    low_priority_cols = ['Meal Size Preference', 'Diet Type', 'Food Intolerances']
    categorical_cols = [
        'Diabetes', 'Hypertension', 'Cardiovascular', 'Digestive Disorders', 
        'Food Allergies', 'BMI Category', 'Meal Size Preference', 
        'Diet Type', 'Food Intolerances', 'Exercise Type', 'Physical Job Activity Level',
        'Work Schedule', 'Sleep Quality', 'Stress Level', 'Meal Timing Regularity',
        'Cooking Skills', 'Food Budget', 'Alcohol Consumption', 'Smoking Status',
        'Snacking Behavior', 'Travel Frequency', 'Cuisine Preferences',
        'Food Texture Preferences', 'Portion Control Ability', 'Previous Diet Success History',
        'Meal Complexity Preference', 'Seasonal Diet Preference', 'Weight Change History',
        'Spice Tolerance'
    ]
    numerical_cols = [
        'Height (cm)', 'Weight (kg)', 'Target Weight (kg)', 'Exercise Frequency', 
        'Exercise Duration (min)', 'Daily Steps Count', 'Sleep Duration (hrs)',
        'Available Cooking Time (min)', 'Water Intake (cups)', 'Eating Out Frequency',
        'Food Prep Time Availability (min)'
    ]

    # 3. Preprocessing pipeline
    numerical_transformer = Pipeline(steps=[('scaler', StandardScaler())])
    categorical_transformer = Pipeline(steps=[('onehot', OneHotEncoder(handle_unknown='ignore'))])
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ])
    preprocessing_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('priority_weighting', HealthPriorityTransformer(
            high_cols=high_priority_cols,
            medium_cols=medium_priority_cols,
            low_cols=low_priority_cols
        ))
    ])
    X_train_processed = preprocessing_pipeline.fit_transform(train_user_params_df)

    # 4. PCA
    pca = PCA(n_components=0.95)
    X_train_reduced = pca.fit_transform(X_train_processed)

    # 5. KMeans clustering
    optimal_k = 5
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    kmeans.fit(X_train_reduced)
    cluster_labels = kmeans.predict(X_train_reduced)
    silhouette = silhouette_score(X_train_reduced, cluster_labels)

    # 6. Cluster profile analysis
    train_user_params_df['cluster'] = cluster_labels
    cluster_analysis = train_user_params_df.groupby('cluster').agg({
        'Diabetes': lambda x: x.value_counts().index[0],
        'Hypertension': lambda x: x.value_counts().index[0],
        'Cardiovascular': lambda x: x.value_counts().index[0],
        'Digestive Disorders': lambda x: x.value_counts().index[0],
        'Food Allergies': lambda x: x.value_counts().index[0],
        'BMI Category': lambda x: x.value_counts().index[0],
        'Meal Size Preference': lambda x: x.value_counts().index[0]
    })
    # Add default Diet Type if missing
    if 'Diet Type' not in cluster_analysis.columns:
        cluster_analysis['Diet Type'] = 'Non-spicy'

    # 7. Recipe suitability dataset creation
    def is_recipe_suitable_for_cluster(cluster_profile, recipe):
        # (Use your suitability logic here)
        # Diabetes check
        if 'Diabetes' in cluster_profile and cluster_profile['Diabetes'] in ['Type 1', 'Type 2']:
            if 'diabetes_friendly' in recipe and not recipe['diabetes_friendly']:
                return 0
        if 'Hypertension' in cluster_profile and cluster_profile['Hypertension'] == 'Yes':
            if 'low_sodium' in recipe and not recipe['low_sodium']:
                return 0
        if 'Cardiovascular' in cluster_profile and cluster_profile['Cardiovascular'] == 'Present':
            if 'heart_healthy' in recipe and not recipe['heart_healthy']:
                return 0
        if 'Digestive Disorders' in cluster_profile and cluster_profile['Digestive Disorders'] == 'Celiac':
            if 'gluten_free' in recipe and not recipe['gluten_free']:
                return 0
        if 'Food Allergies' in cluster_profile and 'ingredients' in recipe and isinstance(recipe['ingredients'], str):
            ingredients_lower = recipe['ingredients'].lower()
            if cluster_profile['Food Allergies'] == 'Nuts' and any(nut in ingredients_lower for nut in ['nuts', 'peanut', 'almond', 'cashew', 'walnut']):
                return 0
            if cluster_profile['Food Allergies'] == 'Dairy' and any(dairy in ingredients_lower for dairy in ['milk', 'cheese', 'yogurt', 'cream', 'butter']):
                return 0
            if cluster_profile['Food Allergies'] == 'Shellfish' and any(shellfish in ingredients_lower for shellfish in ['shrimp', 'crab', 'lobster', 'prawn']):
                return 0
        if 'Diet Type' in cluster_profile and 'ingredients' in recipe and isinstance(recipe['ingredients'], str):
            ingredients_lower = recipe['ingredients'].lower()
            recipe_name_lower = recipe['name'].lower() if 'name' in recipe and isinstance(recipe['name'], str) else ""
            if cluster_profile['Diet Type'] == 'Vegetarian':
                non_veg_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                      'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'cod', 'tilapia']
                if any(ingredient in ingredients_lower or ingredient in recipe_name_lower for ingredient in non_veg_ingredients):
                    return 0
            elif cluster_profile['Diet Type'] == 'Vegan':
                non_vegan_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                        'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'milk', 'cheese',
                                        'yogurt', 'cream', 'butter', 'egg', 'honey', 'dairy']
                if any(ingredient in ingredients_lower or ingredient in recipe_name_lower for ingredient in non_vegan_ingredients):
                    return 0
            elif cluster_profile['Diet Type'] == 'Pescatarian':
                non_pescatarian_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'meat', 'bacon', 'ham', 'sausage']
                if any(ingredient in ingredients_lower or ingredient in recipe_name_lower for ingredient in non_pescatarian_ingredients):
                    return 0
        return 1

    X_train_rf, y_train_rf = [], []
    for cluster_id, cluster_profile in cluster_analysis.iterrows():
        for _, recipe in recipes_df.iterrows():
            recipe_features = recipe[['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber']].values
            features = np.append(recipe_features, cluster_id)
            if 'meal_type' in recipe:
                is_breakfast = 1 if recipe['meal_type'] == 'breakfast' else 0
                is_lunch = 1 if recipe['meal_type'] == 'lunch' else 0
                is_dinner = 1 if recipe['meal_type'] == 'dinner' else 0
                features = np.append(features, [is_breakfast, is_lunch, is_dinner])
            suitability = is_recipe_suitable_for_cluster(cluster_profile, recipe)
            X_train_rf.append(features)
            y_train_rf.append(suitability)
    X_train_rf = np.array(X_train_rf)
    y_train_rf = np.array(y_train_rf)

    # 8. Random Forest training and tuning
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [None, 10],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt', None],
        'class_weight': [None, 'balanced'],
        'bootstrap': [True]
    }
    random_search = RandomizedSearchCV(
        RandomForestClassifier(random_state=42),
        param_distributions=param_grid,
        n_iter=5,
        cv=3,
        scoring='f1',
        n_jobs=-1,
        verbose=0,
        random_state=42
    )
    random_search.fit(X_train_rf, y_train_rf)
    rf_model = random_search.best_estimator_

    # 9. Evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X_train_rf, y_train_rf, test_size=0.2, random_state=42, stratify=y_train_rf
    )
    final_model = RandomForestClassifier(**random_search.best_params_, random_state=42)
    final_model.fit(X_train, y_train)
    y_pred = final_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    conf = confusion_matrix(y_test, y_pred).tolist()

    # 10. Save models and artifacts
    os.makedirs('models', exist_ok=True)
    with open('models/kmeans_model.pkl', 'wb') as f:
        pickle.dump(kmeans, f)
    with open('models/pca.pkl', 'wb') as f:
        pickle.dump(pca, f)
    with open('models/rf_model.pkl', 'wb') as f:
        pickle.dump(final_model, f)
    with open('models/preprocessing_pipeline.pkl', 'wb') as f:
        pickle.dump(preprocessing_pipeline, f)
    with open('models/cluster_analysis.pkl', 'wb') as f:
        pickle.dump(cluster_analysis, f)
    with open('models/categorical_cols.pkl', 'wb') as f:
        pickle.dump(categorical_cols, f)

    # 11. Return metrics and model version info
    metrics = {
        'accuracy': acc,
        'f1_score': f1,
        'precision': prec,
        'recall': rec,
        'silhouette_score': silhouette,
        'confusion_matrix': conf
    }
    model_versions = {
        'kmeans': 'v2',
        'pca': 'v2',
        'rf': 'v2',
        'timestamp': str(pd.Timestamp.now())
    }
    return metrics, model_versions

# --- Retrain endpoint ---
@app.route('/api/retrain_model', methods=['POST'])
def retrain_model():
    print("Received retrain request!")
    try:
        # Find latest user and recipe CSVs in data/
        user_csvs = sorted([f for f in os.listdir('data') if 'user' in f and f.endswith('.csv')])
        recipe_csvs = sorted([f for f in os.listdir('data') if 'recipe' in f and f.endswith('.csv')])
        if not user_csvs or not recipe_csvs:
            return jsonify({'success': False, 'error': 'User or recipe CSV not found'}), 400
        user_csv = user_csvs[-1]
        recipe_csv = recipe_csvs[-1]
        train_user_params_df = pd.read_csv(os.path.join('data', user_csv))
        recipes_df = pd.read_csv(os.path.join('data', recipe_csv))

        # Call your retraining function
        metrics, model_versions = retrain_pipeline(train_user_params_df, recipes_df)

        # Log metrics to MongoDB
        db.model_metrics.insert_one({
            'metrics': metrics,
            'model_versions': model_versions,
            'trained_at': pd.Timestamp.now(),
            'dataset_files': {
                'user_csv': user_csv,
                'recipe_csv': recipe_csv
            }
        })
        return jsonify({'success': True, 'metrics': metrics, 'model_versions': model_versions})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

# --- Diet plan generation function and helpers ---
def generate_diet_plan(user_params, kmeans_model, pca, rf_model, cluster_analysis, days=7):
    recipes_df = fetch_recipes_from_mongodb()
    if recipes_df.empty:
        raise Exception("Failed to fetch recipes from database")
    user_df = pd.DataFrame([user_params])
    for col in user_df.select_dtypes(include=['object']).columns:
        user_df[col] = user_df[col].fillna('Unknown')
    for col in user_df.select_dtypes(include=['object']).columns:
        user_df[col] = user_df[col].astype(str)
    categorical_cols = models['categorical_cols']
    for col in categorical_cols:
        if col not in user_df.columns:
            user_df[col] = 'Unknown'
    user_features = models['preprocessing_pipeline'].transform(user_df)
    user_reduced = pca.transform(user_features)
    user_cluster = kmeans_model.predict(user_reduced)[0]
    cluster_profile = cluster_analysis.loc[user_cluster]
    suitable_recipes = []
    diet_type = user_params.get('Diet Type', 'Non-spicy')
    for _, recipe in recipes_df.iterrows():
        recipe_features = recipe[['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber']].values
        features_with_cluster = np.append(recipe_features, user_cluster)
        # Add meal type features
        is_breakfast = 1 if recipe.get('meal_type') == 'breakfast' else 0
        is_lunch = 1 if recipe.get('meal_type') == 'lunch' else 0
        is_dinner = 1 if recipe.get('meal_type') == 'dinner' else 0
        features_with_cluster = np.append(features_with_cluster, [is_breakfast, is_lunch, is_dinner])
        suitability = models['rf_model'].predict([features_with_cluster])[0]

        suitability = models['rf_model'].predict([features_with_cluster])[0]
        diet_suitable = True
        recipe_name = recipe['name'].lower() if 'name' in recipe and isinstance(recipe['name'], str) else ""
        if 'ingredients' in recipe:
            if isinstance(recipe['ingredients'], list):
                recipe_ingredients = ' '.join(recipe['ingredients']).lower()
            else:
                recipe_ingredients = str(recipe['ingredients']).lower()
        else:
            recipe_ingredients = ""
        if diet_type == 'Vegetarian':
            non_veg_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                  'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'cod', 'tilapia']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_veg_ingredients):
                diet_suitable = False
        elif diet_type == 'Vegan':
            non_vegan_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 
                                    'shrimp', 'meat', 'bacon', 'ham', 'sausage', 'seafood', 'milk', 'cheese',
                                    'yogurt', 'cream', 'butter', 'egg', 'honey', 'dairy']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_vegan_ingredients):
                diet_suitable = False
        elif diet_type == 'Pescatarian':
            non_pescatarian_ingredients = ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'meat', 'bacon', 'ham', 'sausage']
            if any(ingredient in recipe_name or ingredient in recipe_ingredients for ingredient in non_pescatarian_ingredients):
                diet_suitable = False
        if suitability == 1 and diet_suitable:
            suitable_recipes.append(recipe)
    meal_plan = {}
    meal_preference = user_params.get('Meal Size Preference', 'Regular 3 meals')
    if meal_preference == 'Small frequent':
        meal_types = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner']
    elif meal_preference == 'Regular 3 meals':
        meal_types = ['Breakfast', 'Lunch', 'Dinner']
    else:
        meal_types = ['Brunch', 'Dinner']
    bmi_category = user_params.get('BMI Category', 'Normal')
    if bmi_category == 'Underweight':
        daily_calorie_target = 2500
    elif bmi_category == 'Normal':
        daily_calorie_target = 2000
    elif bmi_category == 'Overweight':
        daily_calorie_target = 1800
    else:
        daily_calorie_target = 1500
    used_recipes = set()
    for day in range(1, days+1):
        meal_plan[f'Day {day}'] = {}
        for meal_type in meal_types:
            if 'Breakfast' in meal_type or 'Morning' in meal_type or 'Brunch' in meal_type:
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'breakfast']
            elif 'Lunch' in meal_type or 'Afternoon' in meal_type:
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'lunch']
            else:
                meal_recipes = [r for r in suitable_recipes if 'meal_type' in r and r['meal_type'] == 'dinner']
            unused_recipes = [r for r in meal_recipes if r['name'] not in used_recipes]
            if not unused_recipes and meal_recipes:
                unused_recipes = meal_recipes
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
                    'ingredients': selected_recipe['ingredients'],
                    'instructions': selected_recipe['instructions'] if 'instructions' in selected_recipe else ""
                }
            else:
                meal_plan[f'Day {day}'][meal_type] = "No suitable recipe found"
    nutritional_analysis = analyze_meal_plan(meal_plan)
    return meal_plan, user_cluster, nutritional_analysis

def analyze_meal_plan(meal_plan):
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
    avg_nutrition = {
        'calories': float(np.mean([day['calories'] for day in daily_nutrition])),
        'protein': float(np.mean([day['protein'] for day in daily_nutrition])),
        'carbs': float(np.mean([day['carbs'] for day in daily_nutrition])),
        'fat': float(np.mean([day['fat'] for day in daily_nutrition])),
        'sodium': float(np.mean([day['sodium'] for day in daily_nutrition])),
        'fiber': float(np.mean([day['fiber'] for day in daily_nutrition]))
    }
    total_calories = avg_nutrition['protein'] * 4 + avg_nutrition['carbs'] * 4 + avg_nutrition['fat'] * 9
    if total_calories > 0:
        macro_percentages = {
            'protein_pct': float((avg_nutrition['protein'] * 4 / total_calories * 100)),
            'carbs_pct': float((avg_nutrition['carbs'] * 4 / total_calories * 100)),
            'fat_pct': float((avg_nutrition['fat'] * 9 / total_calories * 100))
        }
    else:
        macro_percentages = {'protein_pct': 0, 'carbs_pct': 0, 'fat_pct': 0}
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
    total_meals = sum(1 for day in meal_plan.values() for meal in day.values())
    suitable_meals = sum(1 for day in meal_plan.values() for meal in day.values() if isinstance(meal, dict))
    meal_coverage = float((suitable_meals / total_meals * 100) if total_meals > 0 else 0)
    return {
        'avg_nutrition': avg_nutrition,
        'macro_percentages': macro_percentages,
        'variety_metrics': variety_metrics,
        'meal_coverage': meal_coverage
    }

# --- Simple test route ---
@app.route('/test', methods=['GET'])
def test_route():
    print("Test route accessed!")
    return jsonify({"message": "Test route works!"})

# --- API endpoint for diet plan generation ---
@app.route('/api/generate_diet_plan', methods=['POST'])
def generate_diet_plan_api():
    print("Diet plan route accessed!")
    try:
        user_params = request.json
        print(f"Received parameters: {user_params}")
        if not models:
            return jsonify({'success': False, 'error': "ML models not loaded"}), 500
        diet_plan, user_cluster, nutritional_analysis = generate_diet_plan(
            user_params, 
            models['kmeans_model'], 
            models['pca'],
            models['rf_model'],
            models['cluster_analysis']
        )
        return jsonify({
            'success': True,
            'diet_plan': diet_plan,
            'user_cluster': int(user_cluster),
            'nutritional_analysis': nutritional_analysis
        })
    except Exception as e:
        print(f"Error generating diet plan: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

# --- Main entry point ---
if __name__ == '__main__':
    print("Starting Flask server...")
    print(f"Registered routes: {[str(rule) for rule in app.url_map.iter_rules()]}")
    app.run(debug=True, host='0.0.0.0', port=5001)
