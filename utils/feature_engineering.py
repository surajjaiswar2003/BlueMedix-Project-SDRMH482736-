# utils/feature_engineering.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class FeatureEngineering:
    def __init__(self):
        # Define parameter categories with proper organization
        self.health_parameters = ['diabetes', 'hypertension', 'cardiovascular', 
                                 'digestive_disorder', 'food_allergies', 'food_intolerances']
        
        self.anthropometric_parameters = ['height', 'weight', 'bmi_category', 
                                        'target_weight', 'weight_change_history']
        
        self.activity_parameters = ['exercise_frequency', 'exercise_duration', 'exercise_type',
                                  'daily_steps', 'physical_job_activity']
        
        self.lifestyle_parameters = ['work_schedule', 'sleep_duration', 'sleep_quality', 
                                   'stress_level', 'meal_timing_regularity', 'cooking_skills',
                                   'available_cooking_time', 'food_budget', 'alcohol_consumption',
                                   'smoking_status', 'water_intake', 'eating_out_frequency',
                                   'snacking_behavior', 'food_prep_time', 'travel_frequency']
        
        self.preference_parameters = ['diet_type', 'meal_size_preference', 'spice_tolerance',
                                    'cuisine_preferences', 'food_texture_preferences',
                                    'portion_control_ability', 'previous_diet_success',
                                    'preferred_meal_complexity', 'seasonal_food_preferences']
        
        # Combined lists for preprocessing
        self.categorical_features = self.health_parameters + ['bmi_category', 'exercise_type', 
                                                            'physical_job_activity'] + self.lifestyle_parameters + self.preference_parameters
        
        self.numerical_features = ['height', 'weight', 'target_weight', 'exercise_frequency',
                                 'exercise_duration', 'daily_steps']
        
        # Parameter importance weights (higher = more important)
        self.parameter_weights = {
            # Health conditions (highest weights)
            'diabetes': 10.0,
            'hypertension': 9.5,
            'cardiovascular': 9.5,
            'digestive_disorder': 9.0,
            'food_allergies': 10.0,
            'food_intolerances': 8.5,
            
            # Physical parameters (high weights)
            'height': 7.0,
            'weight': 7.0,
            'bmi_category': 7.5,
            'target_weight': 8.0,
            'weight_change_history': 6.5,
            
            # Activity factors (medium-high weights)
            'exercise_frequency': 7.0,
            'exercise_duration': 6.5,
            'exercise_type': 6.0,
            'daily_steps': 5.5,
            'physical_job_activity': 6.0,
            
            # Lifestyle factors (medium weights)
            'work_schedule': 5.0,
            'sleep_duration': 5.5,
            'sleep_quality': 5.0,
            'stress_level': 5.5,
            'meal_timing_regularity': 4.5,
            'cooking_skills': 4.0,
            'available_cooking_time': 4.5,
            'food_budget': 3.5,
            'alcohol_consumption': 4.0,
            'smoking_status': 3.5,
            'water_intake': 3.0,
            'eating_out_frequency': 3.0,
            'snacking_behavior': 4.0,
            'food_prep_time': 3.5,
            'travel_frequency': 2.5,
            
            # Preferences (lower weights)
            'diet_type': 5.0,  # Higher because it's a strict requirement
            'meal_size_preference': 3.5,
            'spice_tolerance': 2.5,
            'cuisine_preferences': 3.0,
            'food_texture_preferences': 2.5,
            'portion_control_ability': 3.5,
            'previous_diet_success': 3.0,
            'preferred_meal_complexity': 2.5,
            'seasonal_food_preferences': 2.0
        }
    
    def calculate_bmr(self, gender, weight, height, age):
        """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
        if gender.lower() in ['female', 'f', 'woman']:
            return 10 * weight + 6.25 * height - 5 * age - 161
        else:  # Male or default
            return 10 * weight + 6.25 * height - 5 * age + 5
    
    def calculate_daily_calories(self, user_params):
        """Calculate personalized calorie needs considering all relevant parameters"""
        # Extract basic parameters
        height = float(user_params.get('height', 170))
        weight = float(user_params.get('weight', 70))
        age = float(user_params.get('age', 40))  # Default if not provided
        gender = user_params.get('gender', 'Male')
        
        # Calculate BMR
        bmr = self.calculate_bmr(gender, weight, height, age)
        
        # Activity level calculation using multiple parameters
        activity_levels = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Moderately Active': 1.55,
            'Very Active': 1.725,
            'Extremely Active': 1.9
        }
        
        # Determine base activity level
        base_activity = 'Sedentary'  # Default
        
        # Exercise parameters
        exercise_freq = user_params.get('exercise_frequency', 0)
        exercise_duration = user_params.get('exercise_duration', 0)
        exercise_type = user_params.get('exercise_type', 'None')
        daily_steps = user_params.get('daily_steps', 3000)
        
        # Calculate weekly exercise minutes
        weekly_minutes = exercise_freq * exercise_duration
        
        # Determine base activity from multiple factors
        if weekly_minutes >= 300 or daily_steps >= 12000:  # Very active
            base_activity = 'Very Active'
        elif weekly_minutes >= 150 or daily_steps >= 8000:  # Moderately active
            base_activity = 'Moderately Active'
        elif weekly_minutes >= 60 or daily_steps >= 5000:  # Lightly active
            base_activity = 'Lightly Active'
        
        # Consider strength training's effect on metabolism
        if exercise_type == 'Strength' and weekly_minutes >= 120:
            # Bump up one level for significant strength training
            if base_activity == 'Lightly Active':
                base_activity = 'Moderately Active'
            elif base_activity == 'Moderately Active':
                base_activity = 'Very Active'
        
        # Job activity adjustment
        job_activity = user_params.get('physical_job_activity', 'Sedentary')
        if job_activity == 'Very Active':
            if base_activity != 'Extremely Active':
                # Bump up one level for very active jobs
                if base_activity == 'Very Active':
                    base_activity = 'Extremely Active'
                elif base_activity == 'Moderately Active':
                    base_activity = 'Very Active'
                elif base_activity == 'Lightly Active':
                    base_activity = 'Moderately Active'
                else:
                    base_activity = 'Lightly Active'
        elif job_activity == 'Moderately Active':
            # Smaller bump for moderately active jobs
            if base_activity == 'Sedentary':
                base_activity = 'Lightly Active'
            elif base_activity == 'Lightly Active':
                base_activity = 'Moderately Active'
        
        # Get multiplier based on activity level
        activity_multiplier = activity_levels.get(base_activity, 1.2)
        
        # Calculate TDEE (Total Daily Energy Expenditure)
        tdee = bmr * activity_multiplier
        
        # Weight goals adjustment
        target_weight = float(user_params.get('target_weight', weight))
        weight_difference = target_weight - weight
        
        # More nuanced weight adjustment factors
        if weight_difference < -10:  # Significant weight loss goal
            calorie_adjustment = 0.8  # 20% deficit
        elif weight_difference < -5:  # Moderate weight loss goal
            calorie_adjustment = 0.85  # 15% deficit
        elif weight_difference < 0:  # Small weight loss goal
            calorie_adjustment = 0.9  # 10% deficit
        elif weight_difference > 10:  # Significant weight gain goal
            calorie_adjustment = 1.2  # 20% surplus
        elif weight_difference > 5:  # Moderate weight gain goal
            calorie_adjustment = 1.15  # 15% surplus
        elif weight_difference > 0:  # Small weight gain goal
            calorie_adjustment = 1.1  # 10% surplus
        else:  # Maintenance
            calorie_adjustment = 1.0
        
        # Apply weight goal adjustment
        adjusted_calories = tdee * calorie_adjustment
        
        # Health condition adjustments
        if user_params.get('diabetes') in ['Type 1', 'Type 2']:
            adjusted_calories *= 0.95  # More controlled intake for diabetes
            
        if user_params.get('cardiovascular') == 'Present':
            adjusted_calories *= 0.97  # Slightly reduced for cardiovascular issues
        
        # Lifestyle adjustments
        if user_params.get('stress_level') == 'High':
            adjusted_calories *= 0.97  # High stress can affect metabolism
            
        if user_params.get('sleep_quality') == 'Poor' or user_params.get('sleep_duration', 7) < 6:
            adjusted_calories *= 0.97  # Poor sleep can affect metabolism
            
        if user_params.get('alcohol_consumption') in ['Moderate', 'Heavy']:
            adjusted_calories *= 0.95  # Account for alcohol calories
        
        # Return rounded calorie target
        return round(adjusted_calories)
    
    def calculate_macronutrient_ratios(self, user_params):
        """Calculate personalized macronutrient ratios based on health parameters"""
        # Default balanced ratio
        default_ratio = {
            'protein': 0.3,  # 30% protein
            'carbs': 0.4,    # 40% carbs
            'fats': 0.3      # 30% fats
        }
        
        # Health condition adjustments (highest priority)
        if user_params.get('diabetes') in ['Type 1', 'Type 2']:
            if user_params.get('diabetes') == 'Type 1':
                # Type 1: Consistent, controlled carbs with emphasis on protein
                return {
                    'protein': 0.35,  # Higher protein
                    'carbs': 0.3,     # Lower, consistent carbs
                    'fats': 0.35      # Higher healthy fats
                }
            else:  # Type 2
                return {
                    'protein': 0.33,  # Higher protein
                    'carbs': 0.32,    # Lower carbs
                    'fats': 0.35      # Higher healthy fats
                }
        
        elif user_params.get('cardiovascular') == 'Present':
            # Heart-healthy pattern - higher complex carbs, lower fat
            return {
                'protein': 0.3,   # Moderate protein
                'carbs': 0.5,     # Higher complex carbs
                'fats': 0.2       # Lower fat, mostly unsaturated
            }
        
        elif user_params.get('hypertension') == 'Yes':
            # DASH diet principles - lower fat, higher complex carbs
            return {
                'protein': 0.27,  # Moderate protein
                'carbs': 0.55,    # Higher complex carbs
                'fats': 0.18      # Lower fat
            }
            
        elif user_params.get('digestive_disorder') == 'IBS':
            # IBS often benefits from higher healthy fats, moderate carbs
            return {
                'protein': 0.3,   # Moderate protein
                'carbs': 0.35,    # Moderate carbs
                'fats': 0.35      # Higher fats
            }
            
        # Activity level adjustments (secondary priority)
        exercise_type = user_params.get('exercise_type', 'None')
        exercise_freq = user_params.get('exercise_frequency', 0)
        exercise_duration = user_params.get('exercise_duration', 0)
        
        if exercise_type == 'Strength' and exercise_freq >= 3:
            # Higher protein for strength training
            return {
                'protein': 0.35,  # Higher protein for muscle repair
                'carbs': 0.45,    # Moderate carbs for energy
                'fats': 0.2       # Lower fats
            }
        elif exercise_type == 'Cardio' and (exercise_freq * exercise_duration) >= 150:
            # More carbs for endurance exercise
            return {
                'protein': 0.25,  # Moderate protein
                'carbs': 0.55,    # Higher carbs for endurance
                'fats': 0.2       # Lower fats
            }
        elif exercise_type == 'Mixed' and exercise_freq >= 4:
            # Balanced for mixed intense training
            return {
                'protein': 0.3,   # Moderate-high protein
                'carbs': 0.45,    # Moderate-high carbs
                'fats': 0.25      # Moderate fats
            }
        
        # Diet type adjustments (tertiary priority)
        diet_type = user_params.get('diet_type', 'Regular')
        if diet_type == 'Low-carb':
            return {
                'protein': 0.4,   # Higher protein
                'carbs': 0.2,     # Low carbs
                'fats': 0.4       # Higher fats
            }
        elif diet_type == 'Keto':
            return {
                'protein': 0.25,  # Moderate protein
                'carbs': 0.05,    # Very low carbs
                'fats': 0.7       # Very high fats
            }
        elif diet_type == 'High-protein':
            return {
                'protein': 0.45,  # Very high protein
                'carbs': 0.3,     # Moderate carbs
                'fats': 0.25      # Moderate fats
            }
        elif diet_type == 'Vegan' or diet_type == 'Vegetarian':
            return {
                'protein': 0.25,  # Moderate plant protein
                'carbs': 0.55,    # Higher carbs
                'fats': 0.2       # Moderate fats
            }
        elif diet_type == 'Mediterranean':
            return {
                'protein': 0.25,  # Moderate protein
                'carbs': 0.5,     # Higher complex carbs
                'fats': 0.25      # Moderate healthy fats
            }
        
        # Weight goal adjustments (quarternary priority)
        target_weight = user_params.get('target_weight', user_params.get('weight', 70))
        current_weight = user_params.get('weight', 70)
        weight_diff = target_weight - current_weight
        
        if weight_diff < -5:  # Weight loss goal
            return {
                'protein': 0.35,  # Higher protein to preserve muscle
                'carbs': 0.35,    # Lower carbs
                'fats': 0.3       # Moderate fats
            }
        elif weight_diff > 5:  # Weight gain goal
            return {
                'protein': 0.3,   # Moderate-high protein for muscle gain
                'carbs': 0.5,     # Higher carbs for calorie surplus
                'fats': 0.2       # Moderate fats
            }
        
        # Default case - use standard balanced ratio
        return default_ratio
    
    def get_health_condition_filters(self, user_params, conn):
        """Generate SQL filters based on health conditions and other parameters"""
        cursor = conn.cursor()
        sql_filters = []
        
        # 1. FOOD ALLERGIES AND INTOLERANCES (highest priority)
        food_allergies = user_params.get('food_allergies', 'None')
        if food_allergies != 'None':
            allergies = [a.strip().lower() for a in food_allergies.split(',')]
            
            for allergen in allergies:
                if allergen == 'dairy':
                    sql_filters.append("is_dairy_free = 1")
                elif allergen == 'nuts':
                    # Get nut-containing ingredients
                    try:
                        cursor.execute("SELECT id FROM ingredients WHERE contains_nuts = 1")
                        nut_ingredients = [row[0] for row in cursor.fetchall()]
                        
                        if nut_ingredients:
                            # Get recipes with these ingredients
                            placeholders = ','.join('?' for _ in nut_ingredients)
                            cursor.execute(f"""
                                SELECT DISTINCT recipe_id FROM recipe_ingredients 
                                WHERE ingredient_id IN ({placeholders})
                            """, nut_ingredients)
                            
                            nut_recipes = [row[0] for row in cursor.fetchall()]
                            
                            if nut_recipes:
                                nut_exclusion = f"id NOT IN ({','.join('?' for _ in nut_recipes)})"
                                sql_filters.append((nut_exclusion, nut_recipes))
                    except Exception as e:
                        print(f"Error filtering nut allergens: {e}")
                
                elif allergen == 'shellfish':
                    # Similar approach for shellfish
                    try:
                        cursor.execute("SELECT id FROM ingredients WHERE contains_shellfish = 1")
                        shellfish_ingredients = [row[0] for row in cursor.fetchall()]
                        
                        if shellfish_ingredients:
                            placeholders = ','.join('?' for _ in shellfish_ingredients)
                            cursor.execute(f"""
                                SELECT DISTINCT recipe_id FROM recipe_ingredients 
                                WHERE ingredient_id IN ({placeholders})
                            """, shellfish_ingredients)
                            
                            shellfish_recipes = [row[0] for row in cursor.fetchall()]
                            
                            if shellfish_recipes:
                                shellfish_exclusion = f"id NOT IN ({','.join('?' for _ in shellfish_recipes)})"
                                sql_filters.append((shellfish_exclusion, shellfish_recipes))
                    except Exception as e:
                        print(f"Error filtering shellfish allergens: {e}")
                
                elif allergen == 'gluten':
                    sql_filters.append(("is_gluten_free = 1", []))
        
        # 2. DIGESTIVE DISORDERS
        if user_params.get('digestive_disorder') == 'Celiac':
            sql_filters.append(("is_gluten_free = 1", []))
        elif user_params.get('digestive_disorder') == 'IBS':
            # Check if low_fodmap column exists
            try:
                cursor.execute("PRAGMA table_info(recipes)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'low_fodmap' in columns:
                    sql_filters.append(("low_fodmap = 1", []))
            except Exception as e:
                print(f"Error checking for FODMAP column: {e}")
        
        # 3. DIABETES
        if user_params.get('diabetes') in ['Type 1', 'Type 2']:
            diabetes_type = user_params.get('diabetes')
            
            # Try multiple approaches based on available columns
            try:
                cursor.execute("PRAGMA table_info(recipes)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'diabetes_friendly' in columns:
                    sql_filters.append(("diabetes_friendly = 1", []))
                elif 'glycemic_impact' in columns:
                    threshold = 55 if diabetes_type == 'Type 1' else 70
                    sql_filters.append((f"glycemic_impact < {threshold}", []))
                elif 'carbs' in columns:
                    # Dynamic threshold based on all recipes
                    cursor.execute("SELECT PERCENTILE(carbs, 0.7) FROM recipes")
                    result = cursor.fetchone()
                    if result and result[0]:
                        carb_threshold = result[0]
                        sql_filters.append((f"carbs <= {carb_threshold}", []))
            except Exception as e:
                print(f"Error adding diabetes filters: {e}")
        
        # 4. HYPERTENSION
        if user_params.get('hypertension') == 'Yes':
            try:
                cursor.execute("PRAGMA table_info(recipes)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'hypertension_friendly' in columns:
                    sql_filters.append(("hypertension_friendly = 1", []))
                elif 'dash_diet_score' in columns:
                    sql_filters.append(("dash_diet_score > 5", []))
                elif 'sodium' in columns:
                    # Low sodium approach
                    cursor.execute("SELECT AVG(sodium) FROM recipes")
                    result = cursor.fetchone()
                    if result and result[0]:
                        avg_sodium = result[0]
                        sql_filters.append((f"sodium < {avg_sodium * 0.7}", []))
            except Exception as e:
                print(f"Error adding hypertension filters: {e}")
        
        # 5. CARDIOVASCULAR CONDITION
        if user_params.get('cardiovascular') == 'Present':
            try:
                cursor.execute("PRAGMA table_info(recipes)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'heart_healthy' in columns:
                    sql_filters.append(("heart_healthy = 1", []))
                elif 'anti_inflammatory_score' in columns:
                    sql_filters.append(("anti_inflammatory_score > 5", []))
                elif 'saturated_fat' in columns:
                    # Low saturated fat approach
                    cursor.execute("SELECT AVG(saturated_fat) FROM recipes")
                    result = cursor.fetchone()
                    if result and result[0]:
                        avg_sat_fat = result[0]
                        sql_filters.append((f"saturated_fat < {avg_sat_fat * 0.7}", []))
            except Exception as e:
                print(f"Error adding cardiovascular filters: {e}")
        
        # 6. DIET TYPE
        diet_type = user_params.get('diet_type', 'Regular')
        if diet_type != 'Regular':
            try:
                if diet_type == 'Vegetarian':
                    sql_filters.append(("is_vegetarian = 1", []))
                elif diet_type == 'Vegan':
                    sql_filters.append(("is_vegan = 1", []))
                elif diet_type == 'Keto':
                    # Check if column exists
                    cursor.execute("PRAGMA table_info(recipes)")
                    columns = [row[1] for row in cursor.fetchall()]
                    
                    if 'keto_compatible' in columns:
                        sql_filters.append(("keto_compatible = 1", []))
                    elif 'carbs' in columns:
                        sql_filters.append(("carbs <= 15", []))  # Very low carb for keto
                
                elif diet_type == 'Paleo':
                    # Check if column exists
                    cursor.execute("PRAGMA table_info(recipes)")
                    columns = [row[1] for row in cursor.fetchall()]
                    
                    if 'paleo_compatible' in columns:
                        sql_filters.append(("paleo_compatible = 1", []))
            except Exception as e:
                print(f"Error adding diet type filters: {e}")
        
        # Build the final filter string and parameters
        filter_strings = []
        params = []
        
        for filter_item in sql_filters:
            if isinstance(filter_item, tuple):
                filter_str, filter_params = filter_item
                filter_strings.append(filter_str)
                if filter_params:
                    params.extend(filter_params)
            else:
                filter_strings.append(filter_item)
        
        # Combine all filters with AND
        if filter_strings:
            return " AND ".join(filter_strings), params
        else:
            return "", []
    
    def preprocess_user_parameters(self, user_params):
        """Preprocess user parameters for machine learning models"""
        # Convert user parameters to a DataFrame
        user_df = pd.DataFrame([user_params])
        
        # Fill missing values with defaults
        for feature in self.numerical_features:
            if feature not in user_df.columns or pd.isnull(user_df[feature]).any():
                if feature == 'height':
                    user_df[feature] = 170
                elif feature == 'weight' or feature == 'target_weight':
                    user_df[feature] = 70
                elif feature == 'exercise_frequency':
                    user_df[feature] = 2
                elif feature == 'exercise_duration':
                    user_df[feature] = 30
                elif feature == 'daily_steps':
                    user_df[feature] = 5000
        
        # Create preprocessing pipeline
        numerical_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numerical_transformer, self.numerical_features),
                ('cat', categorical_transformer, self.categorical_features)
            ])
        
        # Fit and transform
        try:
            processed_data = preprocessor.fit_transform(user_df)
            return processed_data
        except Exception as e:
            print(f"Error preprocessing user parameters: {e}")
            return None
    
    def calculate_bmi(self, height, weight):
        """Calculate BMI given height in cm and weight in kg"""
        height_m = height / 100  # Convert cm to m
        bmi = weight / (height_m * height_m)
        
        # Categorize BMI
        if bmi < 18.5:
            category = 'Underweight'
        elif bmi < 25:
            category = 'Normal'
        elif bmi < 30:
            category = 'Overweight'
        else:
            category = 'Obese'
            
        return round(bmi, 1), category
    
    def generate_parameter_summary(self, user_params):
        """Generate a human-readable summary of the user parameters"""
        summary = []
        
        # Health conditions
        health_conditions = []
        if user_params.get('diabetes') not in [None, 'None']:
            health_conditions.append(f"{user_params['diabetes']} Diabetes")
        if user_params.get('hypertension') == 'Yes':
            health_conditions.append("Hypertension")
        if user_params.get('cardiovascular') == 'Present':
            health_conditions.append("Cardiovascular condition")
        if user_params.get('digestive_disorder') not in [None, 'None']:
            health_conditions.append(f"{user_params['digestive_disorder']}")
            
        if health_conditions:
            summary.append(f"Health conditions: {', '.join(health_conditions)}")
            
        if user_params.get('food_allergies') not in [None, 'None']:
            summary.append(f"Food allergies: {user_params['food_allergies']}")
            
        # Physical stats
        if 'height' in user_params and 'weight' in user_params:
            height = user_params['height']
            weight = user_params['weight']
            bmi, bmi_category = self.calculate_bmi(height, weight)
            summary.append(f"Height: {height}cm, Weight: {weight}kg, BMI: {bmi} ({bmi_category})")
            
            if 'target_weight' in user_params:
                target = user_params['target_weight']
                weight_diff = target - weight
                if abs(weight_diff) > 0:
                    direction = "lose" if weight_diff < 0 else "gain"
                    summary.append(f"Weight goal: {direction} {abs(weight_diff):.1f}kg")
        
        # Activity level
        if 'exercise_frequency' in user_params and 'exercise_duration' in user_params:
            freq = user_params['exercise_frequency']
            duration = user_params['exercise_duration']
            if freq > 0 and duration > 0:
                exercise_type = user_params.get('exercise_type', 'general')
                summary.append(f"Exercise: {freq} times per week, {duration} minutes of {exercise_type} exercise")
                
        # Diet type
        if 'diet_type' in user_params and user_params['diet_type'] != 'Regular':
            summary.append(f"Following a {user_params['diet_type']} diet")
            
        # Lifestyle factors
        if user_params.get('sleep_quality') == 'Poor' or user_params.get('sleep_duration', 7) < 6:
            summary.append("Sleep quality is compromised")
            
        if user_params.get('stress_level') == 'High':
            summary.append("Experiencing high stress levels")
            
        # Cooking and meal preparation
        if 'cooking_skills' in user_params and 'available_cooking_time' in user_params:
            summary.append(f"{user_params['cooking_skills']} cooking skills with {user_params['available_cooking_time']} minutes available for cooking")
            
        return summary
