# meal_plan_generator.py
import pandas as pd
import numpy as np
import sqlite3
import os
import joblib
import random

def generate_meal_plan(user_data, user_cluster, days=7):
    """
    Generate a personalized meal plan for a specific user
    
    Args:
        user_data: Dict, DataFrame or Series with user parameters
        user_cluster: The cluster ID assigned to this user
        days: Number of days in the meal plan (default: 7 days for a week)
    
    Returns:
        A dictionary containing the meal plan
    """
    try:
        # Convert user_data to dict if it's a DataFrame or Series
        if isinstance(user_data, pd.DataFrame):
            if len(user_data) > 0:
                user_data = user_data.iloc[0].to_dict()
            else:
                user_data = {}
        elif isinstance(user_data, pd.Series):
            user_data = user_data.to_dict()
        
        # First try loading from database, then csv, then use fallback
        recipes = None
        try:
            # Try to load from SQLite database first
            db_path = 'data/recipes_second.db'
            if os.path.exists(db_path):
                print("Loading recipes from database...")
                conn = sqlite3.connect(db_path)
                recipes = pd.read_sql_query("SELECT * FROM recipes", conn)
                conn.close()
            else:
                # Try to load from CSV file
                recipes_path = 'data/recipes.csv'
                if os.path.exists(recipes_path):
                    print("Loading recipes from CSV file...")
                    recipes = pd.read_csv(recipes_path)
                else:
                    raise FileNotFoundError("Neither recipes database nor CSV file found")
        except Exception as e:
            print(f"Error loading recipes: {e}")
            print("Using fallback recipe data...")
            # Create fallback recipe data (simplified version)
            recipes = create_fallback_recipes()
        
        print(f"Loaded {len(recipes)} recipes")
        
        # Create meal plan structure
        meal_plan = {
            'user_id': user_data.get('user_id', 'unknown'),
            'cluster': user_cluster,
            'days': []
        }
        
        # Determine meal pattern based on preferences
        diet_type = user_data.get('diet_type', '')
        meal_size_preference = user_data.get('meal_size_preference', '')
        
        if meal_size_preference == 'Small frequent meals':
            meal_types = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner']
            meal_times = ['7-8 AM', '10-11 AM', '12-1 PM', '3-4 PM', '6-7 PM']
            calorie_distribution = [0.2, 0.1, 0.3, 0.1, 0.3]  # Percentage of daily calories
        elif diet_type == 'Intermittent Fasting':
            meal_types = ['lunch', 'dinner']
            meal_times = ['12-2 PM', '6-8 PM']
            calorie_distribution = [0.4, 0.6]
        else:  # Regular meals
            meal_types = ['breakfast', 'lunch', 'dinner']
            meal_times = ['7-9 AM', '12-2 PM', '6-8 PM']
            calorie_distribution = [0.25, 0.35, 0.4]
        
        # Get daily calorie needs based on user parameters
        daily_calories = calculate_calorie_needs(user_data)
        print(f"Calculated daily calorie needs: {daily_calories} kcal")
        
        # Calculate macronutrient ratios based on health conditions
        carb_ratio, protein_ratio, fat_ratio = calculate_macro_ratios(user_data)
        print(f"Macro ratios - Carbs: {carb_ratio*100}%, Protein: {protein_ratio*100}%, Fat: {fat_ratio*100}%")
        
        # Apply all filters to get personalized recipe set
        filtered_recipes = filter_recipes_for_user(recipes, user_data)
        if len(filtered_recipes) < 10:
            print("Warning: Very few recipes match all criteria. Using more relaxed filtering.")
            filtered_recipes = filter_recipes_for_user(recipes, user_data, strict=False)
        
        print(f"Found {len(filtered_recipes)} suitable recipes after filtering")
        
        # Separate recipes by meal type
        meal_type_recipes = {}
        for meal_type in set(meal_types):
            if meal_type in ['morning_snack', 'afternoon_snack']:
                # For snacks, use either snack recipes or breakfast recipes as fallback
                snack_recipes = filtered_recipes[filtered_recipes['meal_type'] == 'snack']
                if len(snack_recipes) < 3:  # Need at least 3 options
                    breakfast_recipes = filtered_recipes[filtered_recipes['meal_type'] == 'breakfast']
                    meal_type_recipes[meal_type] = pd.concat([snack_recipes, breakfast_recipes])
                else:
                    meal_type_recipes[meal_type] = snack_recipes
            else:
                type_recipes = filtered_recipes[filtered_recipes['meal_type'] == meal_type]
                if len(type_recipes) < 5:  # Need at least 5 options
                    # Add some recipes from other meal types as fallback
                    additional_recipes = filtered_recipes[filtered_recipes['meal_type'] != meal_type].sample(
                        min(5, len(filtered_recipes[filtered_recipes['meal_type'] != meal_type])))
                    type_recipes = pd.concat([type_recipes, additional_recipes])
                meal_type_recipes[meal_type] = type_recipes
        
        # Track used recipe IDs to avoid repetition in the meal plan
        used_recipe_ids = set()
        
        # Generate meal plan for each day
        for day in range(days):
            daily_plan = {
                'day': day + 1,
                'meals': [],
                'daily_totals': {
                    'calories': 0,
                    'proteins': 0,
                    'carbs': 0,
                    'fats': 0
                }
            }
            
            # Calculate target calories for each meal
            meal_calories = [daily_calories * ratio for ratio in calorie_distribution]
            
            # For each meal in this day
            for i, meal_type in enumerate(meal_types):
                # Get recipes suitable for this meal type
                available_recipes = meal_type_recipes.get(meal_type, filtered_recipes).copy()
                
                # Further filter to avoid repetition when possible
                unused_recipes = available_recipes[~available_recipes['recipe_id'].isin(used_recipe_ids)].copy()
                
                # Only use unused recipes if we have enough options
                if len(unused_recipes) >= 3:
                    available_recipes = unused_recipes.copy()
                
                # If we have recipes for this meal type
                if len(available_recipes) > 0:
                    # Select a recipe that best matches the calorie target for this meal
                    target_calories = meal_calories[i]
                    
                    # Calculate how close each recipe is to the target calories
                    available_recipes.loc[:, 'calorie_diff'] = abs(available_recipes['calories'] - target_calories)
                    
                    # Sort by closest to target calories and take top 3
                    closest_recipes = available_recipes.sort_values('calorie_diff').head(3)
                    
                    # Select one randomly from top 3 closest matches
                    selected_recipe = closest_recipes.sample(1).iloc[0]
                    
                    # Mark this recipe as used
                    used_recipe_ids.add(selected_recipe['recipe_id'])
                    
                    # Create meal entry with all recipe details
                    meal = {
                        'meal_type': meal_type,
                        'timing': meal_times[i],
                        'recipe_id': int(selected_recipe['recipe_id']),
                        'recipe_name': selected_recipe['name'],
                        'ingredients': selected_recipe['ingredients'],
                        'instructions': selected_recipe['instructions'],
                        'calories': float(selected_recipe['calories']),
                        'proteins': float(selected_recipe['protein']),
                        'carbs': float(selected_recipe['carbs']),
                        'fats': float(selected_recipe['fat'])
                    }
                    
                    # Add meal to daily plan
                    daily_plan['meals'].append(meal)
                    
                    # Update daily totals
                    daily_plan['daily_totals']['calories'] += meal['calories']
                    daily_plan['daily_totals']['proteins'] += meal['proteins']
                    daily_plan['daily_totals']['carbs'] += meal['carbs']
                    daily_plan['daily_totals']['fats'] += meal['fats']
            
            # Calculate macronutrient percentages for the day
            if daily_plan['daily_totals']['calories'] > 0:
                carb_calories = daily_plan['daily_totals']['carbs'] * 4
                protein_calories = daily_plan['daily_totals']['proteins'] * 4
                fat_calories = daily_plan['daily_totals']['fats'] * 9
                
                daily_plan['daily_totals']['carb_percent'] = round(carb_calories / daily_plan['daily_totals']['calories'] * 100, 1)
                daily_plan['daily_totals']['protein_percent'] = round(protein_calories / daily_plan['daily_totals']['calories'] * 100, 1)
                daily_plan['daily_totals']['fat_percent'] = round(fat_calories / daily_plan['daily_totals']['calories'] * 100, 1)
            
            # Add this daily plan to the meal plan
            meal_plan['days'].append(daily_plan)
        
        # Calculate overall meal plan statistics
        calculate_meal_plan_stats(meal_plan)
        
        return meal_plan
    
    except Exception as e:
        # Provide detailed error for debugging
        import traceback
        print(traceback.format_exc())
        return {"error": f"Failed to generate meal plan: {str(e)}"}

def calculate_calorie_needs(user_data):
    """Calculate daily calorie needs based on user parameters"""
    # Extract parameters with defaults
    weight = float(user_data.get('weight', 70))  # kg
    height = float(user_data.get('height', 170))  # cm
    age = float(user_data.get('age', 40))  # years (default to 40 if not provided)
    gender = user_data.get('gender', 'male')  # default to male if not provided
    
    # Activity level based on exercise frequency and duration
    exercise_frequency = float(user_data.get('exercise_frequency', 3))  # days per week
    exercise_duration = float(user_data.get('exercise_duration', 30))  # minutes
    
    # Calculate activity score
    activity_score = exercise_frequency * exercise_duration
    
    # Determine activity multiplier
    if activity_score < 60:
        activity_multiplier = 1.375  # Light activity
    elif activity_score < 120:
        activity_multiplier = 1.55  # Moderate activity
    else:
        activity_multiplier = 1.725  # High activity
    
    # Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
    if gender.lower() == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    
    # Adjust based on goal (weight loss, maintenance, or gain)
    weight_goal = user_data.get('weight_change_history', 'stable').lower()
    
    if 'loss' in weight_goal or user_data.get('target_weight', weight) < weight:
        # Calorie deficit for weight loss (15% reduction)
        calorie_adjustment = 0.85
    elif 'gain' in weight_goal or user_data.get('target_weight', weight) > weight:
        # Calorie surplus for weight gain (15% increase)
        calorie_adjustment = 1.15
    else:
        # Maintenance
        calorie_adjustment = 1.0
    
    # Calculate total daily calories
    daily_calories = bmr * activity_multiplier * calorie_adjustment
    
    # Adjust for health conditions
    if user_data.get('diabetes') in ['Type 1', 'Type 2']:
        # Slightly lower calories for diabetic individuals
        daily_calories *= 0.95
    
    # Round to nearest 50 calories
    return round(daily_calories / 50) * 50

def calculate_macro_ratios(user_data):
    """Calculate appropriate macronutrient ratios based on health conditions"""
    # Default balanced ratio
    carb_ratio = 0.50   # 50% of calories from carbs
    protein_ratio = 0.25  # 25% of calories from protein
    fat_ratio = 0.25     # 25% of calories from fat
    
    # Adjust for diabetes
    if user_data.get('diabetes') in ['Type 1', 'Type 2']:
        carb_ratio = 0.40     # Lower carbs (40%)
        protein_ratio = 0.30   # Higher protein (30%)
        fat_ratio = 0.30      # Moderate healthy fats (30%)
    
    # Adjust for cardiovascular issues
    if user_data.get('cardiovascular') == 'Present':
        fat_ratio = 0.25      # Moderate fat (25%)
        protein_ratio = 0.30   # Higher protein (30%)
        carb_ratio = 0.45     # Moderate carbs (45%)
    
    # Adjust for hypertension
    if user_data.get('hypertension') == 'Yes':
        fat_ratio = 0.25      # Moderate fat (25%)
        protein_ratio = 0.30   # Higher protein (30%)
        carb_ratio = 0.45     # Moderate carbs (45%)
    
    # Adjust for activity level based on exercise frequency and duration
    exercise_frequency = float(user_data.get('exercise_frequency', 3))
    exercise_duration = float(user_data.get('exercise_duration', 30))
    activity_score = exercise_frequency * exercise_duration
    
    if activity_score > 150:  # Very active
        # Higher carbs for fuel and higher protein for recovery
        carb_ratio = max(0.45, carb_ratio)
        protein_ratio = max(0.30, protein_ratio)
        # Recalculate fat to ensure ratios sum to 1
        fat_ratio = 1 - carb_ratio - protein_ratio
    
    # Ensure ratios sum to 1
    total = carb_ratio + protein_ratio + fat_ratio
    carb_ratio /= total
    protein_ratio /= total
    fat_ratio /= total
    
    return carb_ratio, protein_ratio, fat_ratio

def filter_recipes_for_user(recipes, user_data, strict=True):
    """Filter recipes based on all relevant user parameters"""
    filtered = recipes.copy()
    
    # Diet type filtering
    diet_type = user_data.get('diet_type', '').lower()
    if diet_type == 'vegetarian' and 'vegetarian' in filtered.columns:
        filtered = filtered[filtered['vegetarian'] == True]
    elif diet_type == 'vegan' and 'vegan' in filtered.columns:
        filtered = filtered[filtered['vegan'] == True]
    elif diet_type == 'pescatarian':
        # For pescatarian, exclude recipes with meat but allow fish
        if 'vegetarian' in filtered.columns:
            # First get vegetarian recipes
            vegetarian_recipes = filtered[filtered['vegetarian'] == True]
            # Then find non-vegetarian recipes that might contain fish
            if 'ingredients' in filtered.columns:
                fish_ingredients = ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'shrimp', 'seafood']
                fish_recipes = filtered[
                    (filtered['vegetarian'] == False) & 
                    (filtered['ingredients'].str.contains('|'.join(fish_ingredients), case=False))
                ]
                # Combine vegetarian and fish recipes
                filtered = pd.concat([vegetarian_recipes, fish_recipes])
    
    # Health condition filtering
    if strict:
        # Diabetes-friendly recipes
        if user_data.get('diabetes') in ['Type 1', 'Type 2', 'Prediabetic'] and 'diabetes_friendly' in filtered.columns:
            filtered = filtered[filtered['diabetes_friendly'] == True]
        elif user_data.get('diabetes') in ['Type 1', 'Type 2', 'Prediabetic'] and 'carbs' in filtered.columns:
            # If no explicit diabetes_friendly flag, filter by carb content
            carb_threshold = recipes['carbs'].median()
            filtered = filtered[filtered['carbs'] <= carb_threshold]
        
        # Heart-healthy recipes for cardiovascular issues
        if user_data.get('cardiovascular') == 'Present' and 'heart_healthy' in filtered.columns:
            filtered = filtered[filtered['heart_healthy'] == True]
        
        # Low sodium for hypertension
        if user_data.get('hypertension') == 'Yes' and 'low_sodium' in filtered.columns:
            filtered = filtered[filtered['low_sodium'] == True]
        elif user_data.get('hypertension') == 'Yes' and 'sodium' in filtered.columns:
            sodium_threshold = recipes['sodium'].median()
            filtered = filtered[filtered['sodium'] <= sodium_threshold]
        
        # Digestive disorder considerations
        if user_data.get('digestive_disorder') == 'Celiac' and 'gluten_free' in filtered.columns:
            filtered = filtered[filtered['gluten_free'] == True]
        
        # Food allergies filtering
        allergies = str(user_data.get('food_allergies', '')).lower()
        if allergies and allergies != 'none' and allergies != 'nan' and 'ingredients' in filtered.columns:
            common_allergens = {
                'dairy': ['milk', 'cheese', 'yogurt', 'cream', 'butter'],
                'nuts': ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'nut'],
                'gluten': ['wheat', 'barley', 'rye', 'gluten'],
                'shellfish': ['shrimp', 'crab', 'lobster', 'clam', 'mussel', 'shellfish'],
                'eggs': ['egg'],
                'soy': ['soy', 'tofu', 'edamame'],
                'fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia']
            }
            
            for allergen, terms in common_allergens.items():
                if allergen in allergies or any(term in allergies for term in terms):
                    filtered = filtered[~filtered['ingredients'].str.contains('|'.join(terms), case=False)]
    
    # Cuisine preferences
    cuisine = user_data.get('cuisine_preferences', '').lower()
    if cuisine and cuisine != 'mixed' and 'diet_type' in filtered.columns:
        # Only apply if we have enough recipes to avoid over-filtering
        cuisine_recipes = filtered[filtered['diet_type'].str.lower() == cuisine]
        if len(cuisine_recipes) >= 10:
            filtered = cuisine_recipes
    
    # Cooking complexity based on cooking skills
    cooking_skills = user_data.get('cooking_skills', '').lower()
    if cooking_skills and 'cooking_difficulty' in filtered.columns:
        if cooking_skills == 'beginner' or cooking_skills == 'basic':
            filtered = filtered[filtered['cooking_difficulty'] != 'Hard']
        elif cooking_skills == 'intermediate':
            # All cooking difficulties are fine
            pass
        elif cooking_skills == 'advanced':
            # Prefer more complex recipes
            complex_recipes = filtered[filtered['cooking_difficulty'] == 'Hard']
            if len(complex_recipes) >= 10:
                filtered = complex_recipes
    
    # Preparation time based on available cooking time
    available_time = user_data.get('available_cooking_time', 0)
    if available_time and available_time > 0 and 'prep_time' in filtered.columns:
        filtered = filtered[filtered['prep_time'] <= available_time]
    
    # If after all filtering we have too few recipes, return a less filtered set
    if len(filtered) < 5 and strict:
        return filter_recipes_for_user(recipes, user_data, strict=False)
    
    return filtered

def create_fallback_recipes():
    """Create a fallback recipe dataset if the real data isn't available"""
    # Create simple recipe data with essential fields
    recipes = []
    
    # Breakfast recipes
    breakfast_names = [
        "Greek Yogurt with Berries", "Avocado Toast with Egg", "Oatmeal with Fruits",
        "Vegetable Omelette", "Whole Grain Pancakes", "Smoothie Bowl",
        "Chia Pudding", "Breakfast Burrito", "Cottage Cheese with Fruit"
    ]
    
    for i, name in enumerate(breakfast_names):
        recipes.append({
            'recipe_id': i+1,
            'name': name,
            'meal_type': 'breakfast',
            'ingredients': f"Ingredients for {name}",
            'instructions': f"Instructions for preparing {name}",
            'calories': random.randint(250, 450),
            'protein': random.randint(10, 25),
            'carbs': random.randint(20, 50),
            'fat': random.randint(5, 20),
            'vegetarian': random.choice([True, False]),
            'vegan': random.choice([True, False]),
            'gluten_free': random.choice([True, False]),
            'diabetes_friendly': random.choice([True, False]),
            'heart_healthy': random.choice([True, False]),
            'low_sodium': random.choice([True, False]),
            'cooking_difficulty': random.choice(['Easy', 'Medium', 'Hard']),
            'prep_time': random.randint(5, 30),
            'diet_type': random.choice(['American', 'Mediterranean', 'Asian', 'European'])
        })
    
    # Lunch recipes
    lunch_names = [
        "Chicken Salad", "Quinoa Bowl", "Vegetable Soup", "Tuna Sandwich",
        "Mediterranean Plate", "Vegetable Stir-fry", "Turkey Wrap",
        "Lentil Soup", "Grilled Salmon"
    ]
    
    for i, name in enumerate(lunch_names):
        recipes.append({
            'recipe_id': len(recipes)+1,
            'name': name,
            'meal_type': 'lunch',
            'ingredients': f"Ingredients for {name}",
            'instructions': f"Instructions for preparing {name}",
            'calories': random.randint(350, 600),
            'protein': random.randint(15, 35),
            'carbs': random.randint(30, 60),
            'fat': random.randint(10, 25),
            'vegetarian': random.choice([True, False]),
            'vegan': random.choice([True, False]),
            'gluten_free': random.choice([True, False]),
            'diabetes_friendly': random.choice([True, False]),
            'heart_healthy': random.choice([True, False]),
            'low_sodium': random.choice([True, False]),
            'cooking_difficulty': random.choice(['Easy', 'Medium', 'Hard']),
            'prep_time': random.randint(10, 45),
            'diet_type': random.choice(['American', 'Mediterranean', 'Asian', 'European'])
        })
    
    # Dinner recipes
    dinner_names = [
        "Grilled Chicken with Vegetables", "Salmon with Sweet Potato",
        "Vegetable Stir-fry with Tofu", "Beef and Broccoli", "Shrimp Pasta",
        "Vegetable Curry", "Baked Fish", "Turkey Chili", "Eggplant Parmesan"
    ]
    
    for i, name in enumerate(dinner_names):
        recipes.append({
            'recipe_id': len(recipes)+1,
            'name': name,
            'meal_type': 'dinner',
            'ingredients': f"Ingredients for {name}",
            'instructions': f"Instructions for preparing {name}",
            'calories': random.randint(400, 700),
            'protein': random.randint(20, 40),
            'carbs': random.randint(30, 70),
            'fat': random.randint(10, 30),
            'vegetarian': random.choice([True, False]),
            'vegan': random.choice([True, False]),
            'gluten_free': random.choice([True, False]),
            'diabetes_friendly': random.choice([True, False]),
            'heart_healthy': random.choice([True, False]),
            'low_sodium': random.choice([True, False]),
            'cooking_difficulty': random.choice(['Easy', 'Medium', 'Hard']),
            'prep_time': random.randint(15, 60),
            'diet_type': random.choice(['American', 'Mediterranean', 'Asian', 'European'])
        })
    
    # Snack recipes
    snack_names = [
        "Apple with Nut Butter", "Greek Yogurt with Honey", "Hummus with Vegetables",
        "Trail Mix", "Protein Smoothie", "Hard-boiled Eggs", "Fruit and Cheese"
    ]
    
    for i, name in enumerate(snack_names):
        recipes.append({
            'recipe_id': len(recipes)+1,
            'name': name,
            'meal_type': 'snack',
            'ingredients': f"Ingredients for {name}",
            'instructions': f"Instructions for preparing {name}",
            'calories': random.randint(100, 250),
            'protein': random.randint(5, 15),
            'carbs': random.randint(10, 25),
            'fat': random.randint(5, 15),
            'vegetarian': random.choice([True, False]),
            'vegan': random.choice([True, False]),
            'gluten_free': random.choice([True, False]),
            'diabetes_friendly': random.choice([True, False]),
            'heart_healthy': random.choice([True, False]),
            'low_sodium': random.choice([True, False]),
            'cooking_difficulty': random.choice(['Easy', 'Medium', 'Hard']),
            'prep_time': random.randint(5, 15),
            'diet_type': random.choice(['American', 'Mediterranean', 'Asian', 'European'])
        })
    
    return pd.DataFrame(recipes)

def calculate_meal_plan_stats(meal_plan):
    """Calculate and add overall statistics to the meal plan"""
    total_calories = 0
    total_proteins = 0
    total_carbs = 0
    total_fats = 0
    day_count = len(meal_plan['days'])
    
    for day in meal_plan['days']:
        total_calories += day['daily_totals']['calories']
        total_proteins += day['daily_totals']['proteins']
        total_carbs += day['daily_totals']['carbs']
        total_fats += day['daily_totals']['fats']
    
    # Calculate averages
    if day_count > 0:
        meal_plan['overall_stats'] = {
            'avg_daily_calories': round(total_calories / day_count),
            'avg_daily_proteins': round(total_proteins / day_count),
            'avg_daily_carbs': round(total_carbs / day_count),
            'avg_daily_fats': round(total_fats / day_count)
        }
        
        # Calculate overall macronutrient percentages
        total_calories_from_macros = (total_proteins * 4) + (total_carbs * 4) + (total_fats * 9)
        if total_calories_from_macros > 0:
            meal_plan['overall_stats']['overall_protein_percent'] = round((total_proteins * 4) / total_calories_from_macros * 100, 1)
            meal_plan['overall_stats']['overall_carb_percent'] = round((total_carbs * 4) / total_calories_from_macros * 100, 1)
            meal_plan['overall_stats']['overall_fat_percent'] = round((total_fats * 9) / total_calories_from_macros * 100, 1)

# Save the function if this script is run directly
if __name__ == '__main__':
    joblib.dump(generate_meal_plan, 'models/meal_plan_generator.pkl')
    print("Meal plan generator saved successfully!")
