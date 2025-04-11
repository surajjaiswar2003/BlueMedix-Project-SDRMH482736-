# test_model.py
import pandas as pd
import numpy as np
import joblib
import os
import json
import sys
from tabulate import tabulate  # Install with: pip install tabulate

# Ensure meal_plan_generator can be imported properly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    from meal_plan_generator import generate_meal_plan
except ImportError:
    print("Error: Could not import meal_plan_generator.")
    print("Make sure meal_plan_generator.py is in the current directory or in your Python path.")
    sys.exit(1)

def create_comprehensive_test_profiles():
    """Create diverse test user profiles with combined health conditions and varied parameters"""
    test_users = [
        # Profile 1: Diabetes + Hypertension + Vegetarian
        {
            "name": "Diabetic Hypertensive Vegetarian",
            "user_id": 1,
            "diabetes": "Type 2",
            "hypertension": "Yes",
            "cardiovascular": "Present",
            "digestive_disorder": "Non-IBS",
            "food_allergies": "None",
            "height": 170,
            "weight": 80,
            "age": 55,
            "gender": "female",
            "bmi_category": "Overweight",
            "target_weight": 70,
            "weight_change_history": "Gradual loss",
            "exercise_frequency": 3,
            "exercise_duration": 45,
            "exercise_type": "Walking",
            "daily_steps": 6000,
            "physical_job_activity": "Moderate",
            "work_schedule": "Regular",
            "sleep_duration": 7,
            "sleep_quality": "Good",
            "stress_level": "Moderate",
            "meal_timing_regularity": "Regular",
            "cooking_skills": "Intermediate",
            "available_cooking_time": 40,
            "food_budget": "Moderate",
            "alcohol_consumption": "Occasional",
            "smoking_status": "Non-smoker",
            "water_intake": 8,
            "eating_out_frequency": 2,
            "snacking_behavior": "Healthy",
            "food_prep_time": 30,
            "travel_frequency": "Occasional",
            "diet_type": "Vegetarian",
            "meal_size_preference": "Small frequent meals",
            "spice_tolerance": "Medium",
            "cuisine_preferences": "Mediterranean",
            "food_texture_preferences": "Soft",
            "portion_control_ability": "Good",
            "previous_diet_success": "Yes",
            "food_intolerances": "None",
            "preferred_meal_complexity": "Moderate",
            "seasonal_food_preferences": "Yes"
        },
        
        # Profile 2: Athletic Vegan with Gluten Sensitivity
        {
            "name": "Athletic Vegan with Gluten Sensitivity",
            "user_id": 2,
            "diabetes": "None",
            "hypertension": "No",
            "cardiovascular": "Absent",
            "digestive_disorder": "None",
            "food_allergies": "Gluten",
            "height": 165,
            "weight": 55,
            "age": 28,
            "gender": "female",
            "bmi_category": "Normal",
            "target_weight": 55,
            "weight_change_history": "Stable",
            "exercise_frequency": 5,
            "exercise_duration": 60,
            "exercise_type": "Running",
            "daily_steps": 10000,
            "physical_job_activity": "Active",
            "work_schedule": "Regular",
            "sleep_duration": 8,
            "sleep_quality": "Excellent",
            "stress_level": "Low",
            "meal_timing_regularity": "Regular",
            "cooking_skills": "Advanced",
            "available_cooking_time": 60,
            "food_budget": "High",
            "alcohol_consumption": "None",
            "smoking_status": "Non-smoker",
            "water_intake": 10,
            "eating_out_frequency": 1,
            "snacking_behavior": "Healthy",
            "food_prep_time": 45,
            "travel_frequency": "Rare",
            "diet_type": "Vegan",
            "meal_size_preference": "Regular meals",
            "spice_tolerance": "High",
            "cuisine_preferences": "Asian",
            "food_texture_preferences": "Crunchy",
            "portion_control_ability": "Excellent",
            "previous_diet_success": "Yes",
            "food_intolerances": "Gluten",
            "preferred_meal_complexity": "Complex",
            "seasonal_food_preferences": "No"
        },
        
        # Profile 3: Prediabetic + Celiac + Low Activity
        {
            "name": "Prediabetic Celiac Sedentary",
            "user_id": 3,
            "diabetes": "Prediabetic",
            "hypertension": "No",
            "cardiovascular": "Absent",
            "digestive_disorder": "Celiac",
            "food_allergies": "Gluten",
            "height": 175,
            "weight": 90,
            "age": 42,
            "gender": "male",
            "bmi_category": "Obese",
            "target_weight": 75,
            "weight_change_history": "Gradual loss",
            "exercise_frequency": 1,
            "exercise_duration": 20,
            "exercise_type": "None",
            "daily_steps": 2000,
            "physical_job_activity": "Sedentary",
            "work_schedule": "Irregular",
            "sleep_duration": 6,
            "sleep_quality": "Poor",
            "stress_level": "High",
            "meal_timing_regularity": "Irregular",
            "cooking_skills": "Basic",
            "available_cooking_time": 20,
            "food_budget": "Low",
            "alcohol_consumption": "Moderate",
            "smoking_status": "Ex-smoker",
            "water_intake": 5,
            "eating_out_frequency": 4,
            "snacking_behavior": "Frequent",
            "food_prep_time": 15,
            "travel_frequency": "Frequent",
            "diet_type": "Non-vegetarian",
            "meal_size_preference": "Large infrequent meals",
            "spice_tolerance": "Low",
            "cuisine_preferences": "American",
            "food_texture_preferences": "Soft",
            "portion_control_ability": "Poor",
            "previous_diet_success": "No",
            "food_intolerances": "Gluten",
            "preferred_meal_complexity": "Simple",
            "seasonal_food_preferences": "No"
        },
        
        # Profile 4: Hypertensive + Cardiovascular + Dairy Allergy
        {
            "name": "Cardiac Hypertensive with Dairy Allergy",
            "user_id": 4,
            "diabetes": "None",
            "hypertension": "Yes",
            "cardiovascular": "Present",
            "digestive_disorder": "Non-IBS",
            "food_allergies": "Dairy",
            "height": 180,
            "weight": 85,
            "age": 60,
            "gender": "male",
            "bmi_category": "Overweight",
            "target_weight": 78,
            "weight_change_history": "Fluctuating",
            "exercise_frequency": 3,
            "exercise_duration": 30,
            "exercise_type": "Swimming",
            "daily_steps": 5000,
            "physical_job_activity": "Light",
            "work_schedule": "Regular",
            "sleep_duration": 7,
            "sleep_quality": "Fair",
            "stress_level": "Moderate",
            "meal_timing_regularity": "Regular",
            "cooking_skills": "Intermediate",
            "available_cooking_time": 35,
            "food_budget": "Moderate",
            "alcohol_consumption": "None",
            "smoking_status": "Ex-smoker",
            "water_intake": 8,
            "eating_out_frequency": 2,
            "snacking_behavior": "Moderate",
            "food_prep_time": 30,
            "travel_frequency": "Occasional",
            "diet_type": "Pescatarian",
            "meal_size_preference": "Regular meals",
            "spice_tolerance": "Medium",
            "cuisine_preferences": "Mediterranean",
            "food_texture_preferences": "Various",
            "portion_control_ability": "Good",
            "previous_diet_success": "Yes",
            "food_intolerances": "Dairy",
            "preferred_meal_complexity": "Moderate",
            "seasonal_food_preferences": "Yes"
        },
        
        # Profile 5: Diabetic + Bariatric Surgery Patient
        {
            "name": "Diabetic Post-Bariatric",
            "user_id": 5,
            "diabetes": "Type 2",
            "hypertension": "No",
            "cardiovascular": "Absent",
            "digestive_disorder": "Post-bariatric",
            "food_allergies": "None",
            "height": 168,
            "weight": 75,
            "age": 45,
            "gender": "female",
            "bmi_category": "Overweight",
            "target_weight": 65,
            "weight_change_history": "Recent significant loss",
            "exercise_frequency": 4,
            "exercise_duration": 30,
            "exercise_type": "Walking",
            "daily_steps": 7000,
            "physical_job_activity": "Light",
            "work_schedule": "Regular",
            "sleep_duration": 7,
            "sleep_quality": "Good",
            "stress_level": "Low",
            "meal_timing_regularity": "Very regular",
            "cooking_skills": "Intermediate",
            "available_cooking_time": 40,
            "food_budget": "Moderate",
            "alcohol_consumption": "None",
            "smoking_status": "Non-smoker",
            "water_intake": 9,
            "eating_out_frequency": 1,
            "snacking_behavior": "Very controlled",
            "food_prep_time": 30,
            "travel_frequency": "Rare",
            "diet_type": "Non-vegetarian",
            "meal_size_preference": "Small frequent meals",
            "spice_tolerance": "Medium",
            "cuisine_preferences": "Mixed",
            "food_texture_preferences": "Soft",
            "portion_control_ability": "Excellent",
            "previous_diet_success": "Yes",
            "food_intolerances": "None",
            "preferred_meal_complexity": "Simple",
            "seasonal_food_preferences": "No"
        }
    ]
    return test_users

def analyze_meal_plan(meal_plan, user_profile):
    """Perform comprehensive analysis of the meal plan against user health parameters"""
    print(f"\n{'='*80}")
    print(f"DETAILED ANALYSIS FOR: {user_profile['name']}")
    print(f"{'='*80}")
    
    if isinstance(meal_plan, dict) and 'error' in meal_plan:
        print(f"ERROR GENERATING MEAL PLAN: {meal_plan['error']}")
        return False
    
    # Check if plan has days
    if 'days' not in meal_plan or not meal_plan['days']:
        print("ERROR: Meal plan has no days")
        return False
    
    # ----------------- Basic Plan Statistics -----------------
    total_days = len(meal_plan['days'])
    daily_calories = []
    daily_proteins = []
    daily_carbs = []
    daily_fats = []
    daily_meal_counts = []
    
    for day in meal_plan['days']:
        if 'meals' not in day or not day['meals']:
            continue
        
        daily_meal_counts.append(len(day['meals']))
        
        if 'daily_totals' in day:
            # Use pre-calculated totals if available
            totals = day['daily_totals']
            daily_calories.append(totals.get('calories', 0))
            daily_proteins.append(totals.get('proteins', 0))
            daily_carbs.append(totals.get('carbs', 0))
            daily_fats.append(totals.get('fats', 0))
        else:
            # Calculate totals from meals
            day_calories = sum(meal.get('calories', 0) for meal in day['meals'])
            day_proteins = sum(meal.get('proteins', 0) for meal in day['meals'])
            day_carbs = sum(meal.get('carbs', 0) for meal in day['meals'])
            day_fats = sum(meal.get('fats', 0) for meal in day['meals'])
            
            daily_calories.append(day_calories)
            daily_proteins.append(day_proteins)
            daily_carbs.append(day_carbs)
            daily_fats.append(day_fats)
    
    # Calculate averages
    avg_calories = sum(daily_calories) / len(daily_calories) if daily_calories else 0
    avg_proteins = sum(daily_proteins) / len(daily_proteins) if daily_proteins else 0
    avg_carbs = sum(daily_carbs) / len(daily_carbs) if daily_carbs else 0
    avg_fats = sum(daily_fats) / len(daily_fats) if daily_fats else 0
    avg_meal_count = sum(daily_meal_counts) / len(daily_meal_counts) if daily_meal_counts else 0
    
    # ----------------- Calculate Expected Values -----------------
    # Calculate expected calories based on user profile
    weight = user_profile.get('weight', 70)
    height = user_profile.get('height', 170)
    age = user_profile.get('age', 40)
    gender = user_profile.get('gender', 'male')
    exercise_frequency = user_profile.get('exercise_frequency', 3)
    exercise_duration = user_profile.get('exercise_duration', 30)
    
    # BMR calculation using Mifflin-St Jeor equation
    if gender.lower() == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    
    # Activity multiplier
    activity_score = exercise_frequency * exercise_duration
    if activity_score < 60:
        activity_multiplier = 1.375  # Lightly active
    elif activity_score < 120:
        activity_multiplier = 1.55  # Moderately active
    else:
        activity_multiplier = 1.725  # Very active
    
    # Adjust for weight goals
    if user_profile.get('target_weight', weight) < weight:
        calorie_adjustment = 0.85  # Weight loss
    elif user_profile.get('target_weight', weight) > weight:
        calorie_adjustment = 1.15  # Weight gain
    else:
        calorie_adjustment = 1.0  # Maintenance
    
    expected_calories = bmr * activity_multiplier * calorie_adjustment
    
    # Determine expected meal pattern
    meal_pattern = user_profile.get('meal_size_preference', '')
    expected_meal_count = 3  # Default for "Regular meals"
    if meal_pattern == 'Small frequent meals':
        expected_meal_count = 5
    elif meal_pattern == 'Large infrequent meals' or meal_pattern == 'Intermittent Fasting':
        expected_meal_count = 2
    
    # ----------------- Print Analysis Results -----------------
    print("\n1. NUTRITIONAL ANALYSIS:")
    print(f"   Average daily calories: {avg_calories:.1f} kcal (Target: {expected_calories:.1f} kcal)")
    print(f"   Average daily protein: {avg_proteins:.1f}g ({avg_proteins*4/avg_calories*100:.1f}% of calories)")
    print(f"   Average daily carbs: {avg_carbs:.1f}g ({avg_carbs*4/avg_calories*100:.1f}% of calories)")
    print(f"   Average daily fats: {avg_fats:.1f}g ({avg_fats*9/avg_calories*100:.1f}% of calories)")
    
    print("\n2. MEAL PATTERN ANALYSIS:")
    print(f"   Average daily meal count: {avg_meal_count:.1f} (Expected: {expected_meal_count})")
    
    print("\n3. HEALTH CONDITION COMPATIBILITY:")
    
    # Diabetes analysis
    if user_profile.get('diabetes') in ['Type 1', 'Type 2', 'Prediabetic']:
        carb_percent = (avg_carbs * 4) / avg_calories * 100 if avg_calories > 0 else 0
        if carb_percent <= 45:
            diabetes_status = "✓ GOOD - Carbohydrate percentage is suitable for diabetes management"
        else:
            diabetes_status = "✗ CONCERN - Carbohydrate percentage is higher than recommended for diabetes"
        print(f"   Diabetes: {user_profile.get('diabetes')}")
        print(f"   Carbohydrate percentage: {carb_percent:.1f}% (Target: ≤45%)")
        print(f"   Assessment: {diabetes_status}")
    
    # Hypertension analysis
    if user_profile.get('hypertension') == 'Yes':
        print(f"   Hypertension: Present")
        print(f"   Note: Meal plan should contain low-sodium recipes")
        # The actual sodium content would be evaluated here if available in the meal details
    
    # Cardiovascular issues
    if user_profile.get('cardiovascular') == 'Present':
        fat_percent = (avg_fats * 9) / avg_calories * 100 if avg_calories > 0 else 0
        if fat_percent <= 30:
            cardiac_status = "✓ GOOD - Fat percentage is suitable for cardiovascular health"
        else:
            cardiac_status = "✗ CONCERN - Fat percentage is higher than recommended for cardiovascular health"
        print(f"   Cardiovascular issues: Present")
        print(f"   Fat percentage: {fat_percent:.1f}% (Target: ≤30%)")
        print(f"   Assessment: {cardiac_status}")
    
    # Digestive disorders
    if user_profile.get('digestive_disorder') in ['Celiac', 'IBS', 'Post-bariatric']:
        print(f"   Digestive disorder: {user_profile.get('digestive_disorder')}")
        if user_profile.get('digestive_disorder') == 'Celiac':
            print(f"   Note: Meal plan must be strictly gluten-free")
        elif user_profile.get('digestive_disorder') == 'Post-bariatric':
            print(f"   Note: Meal plan should feature small portions high in protein, low in fat and sugar")
    
    # Food allergies and intolerances
    if user_profile.get('food_allergies') and user_profile.get('food_allergies') != 'None':
        print(f"   Food allergies: {user_profile.get('food_allergies')}")
        print(f"   Note: Meal plan must exclude all sources of {user_profile.get('food_allergies')}")
    
    if user_profile.get('food_intolerances') and user_profile.get('food_intolerances') != 'None':
        print(f"   Food intolerances: {user_profile.get('food_intolerances')}")
        print(f"   Note: Meal plan should minimize {user_profile.get('food_intolerances')}")
    
    # Diet type
    print(f"\n4. DIETARY PREFERENCE ASSESSMENT:")
    print(f"   Diet type: {user_profile.get('diet_type', 'Not specified')}")
    
    if user_profile.get('diet_type') == 'Vegetarian':
        print(f"   Note: Meal plan should exclude all meat products")
    elif user_profile.get('diet_type') == 'Vegan':
        print(f"   Note: Meal plan should exclude all animal products")
    elif user_profile.get('diet_type') == 'Pescatarian':
        print(f"   Note: Meal plan should include fish but no other meat")
    
    # Check meal plan duration
    print(f"\n5. MEAL PLAN COMPLETENESS:")
    print(f"   Plan duration: {total_days} days (Target: 7 days)")
    
    # Print any overall statistics from the meal plan
    if 'overall_stats' in meal_plan:
        print("\n6. OVERALL STATISTICS:")
        stats = meal_plan['overall_stats']
        for key, value in stats.items():
            print(f"   {key.replace('_', ' ').title()}: {value}")
    
    print(f"\n{'='*80}")
    
    # Return True if the plan is valid
    return True

def display_meal_plan_table(meal_plan, user_name):
    """Display a formatted 7-day meal plan in a table format"""
    print(f"\n{'='*100}")
    print(f"7-DAY MEAL PLAN FOR: {user_name}")
    print(f"{'='*100}")
    
    if 'days' not in meal_plan or not meal_plan['days']:
        print("No meal plan data available.")
        return
    
    # Create a table for each day
    for day in meal_plan['days']:
        day_num = day.get('day', 0)
        print(f"\nDAY {day_num}:")
        print("-" * 100)
        
        if 'meals' not in day or not day['meals']:
            print("No meals specified for this day.")
            continue
        
        # Prepare table data
        table_data = []
        headers = ["Meal Type", "Time", "Recipe", "Ingredients", "Calories", "Protein", "Carbs", "Fat"]
        
        for meal in day['meals']:
            # Truncate ingredients and instructions for display
            ingredients = meal.get('ingredients', '')
            if len(ingredients) > 50:
                ingredients = ingredients[:47] + "..."
            
            row = [
                meal.get('meal_type', ''),
                meal.get('timing', ''),
                meal.get('recipe_name', ''),
                ingredients,
                f"{meal.get('calories', 0)} kcal",
                f"{meal.get('proteins', 0)}g",
                f"{meal.get('carbs', 0)}g",
                f"{meal.get('fats', 0)}g"
            ]
            table_data.append(row)
        
        # Display the table for this day
        try:
            print(tabulate(table_data, headers=headers, tablefmt="grid"))
        except NameError:
            # If tabulate is not installed, use a simpler format
            print("\t".join(headers))
            print("-" * 100)
            for row in table_data:
                print("\t".join(str(cell) for cell in row))
        
        # Display daily totals if available
        if 'daily_totals' in day:
            totals = day['daily_totals']
            print("\nDaily Totals:")
            print(f"Calories: {totals.get('calories', 0)} kcal | "
                  f"Protein: {totals.get('proteins', 0)}g | "
                  f"Carbs: {totals.get('carbs', 0)}g | "
                  f"Fat: {totals.get('fats', 0)}g")
            
            if 'carb_percent' in totals:
                print(f"Macronutrient Distribution: "
                      f"Protein: {totals.get('protein_percent', 0)}% | "
                      f"Carbs: {totals.get('carb_percent', 0)}% | "
                      f"Fat: {totals.get('fat_percent', 0)}%")

def test_meal_plan_generation():
    """Test meal plan generation for diverse user profiles with combined health conditions"""
    test_users = create_comprehensive_test_profiles()
    
    # Ensure output directory exists
    os.makedirs('test_results', exist_ok=True)
    
    results = []
    
    for user in test_users:
        print(f"\n{'='*80}")
        print(f"GENERATING MEAL PLAN FOR: {user['name']}")
        print(f"{'='*80}")
        print("Key health parameters:")
        print(f"  • Diabetes: {user.get('diabetes', 'None')}")
        print(f"  • Hypertension: {user.get('hypertension', 'No')}")
        print(f"  • Cardiovascular: {user.get('cardiovascular', 'Absent')}")
        print(f"  • Diet type: {user.get('diet_type', 'Not specified')}")
        print(f"  • Allergies: {user.get('food_allergies', 'None')}")
        print(f"  • Activity level: {user.get('exercise_frequency', 0)} days/week, {user.get('exercise_duration', 0)} min/session")
        
        # For testing, use cluster 0
        user_cluster = 0
        
        # Generate meal plan
        try:
            print("\nGenerating 7-day meal plan...")
            meal_plan = generate_meal_plan(user, user_cluster, days=7)
            
            # Display detailed meal plan table
            display_meal_plan_table(meal_plan, user['name'])
            
            # Analyze meal plan
            is_valid = analyze_meal_plan(meal_plan, user)
            
            # Save meal plan to file
            filename = f"test_results/meal_plan_{user['name'].replace(' ', '_').lower()}.json"
            with open(filename, 'w') as f:
                json.dump(meal_plan, f, indent=2)
            
            print(f"\nMeal plan saved to: {filename}")
            
            results.append({
                'user': user['name'],
                'cluster': user_cluster,
                'is_valid': is_valid
            })
            
        except Exception as e:
            import traceback
            print(f"Error generating meal plan: {e}")
            print(traceback.format_exc())
            results.append({
                'user': user['name'],
                'cluster': user_cluster,
                'is_valid': False,
                'error': str(e)
            })
    
    # Print summary
    print("\n\nTEST SUMMARY:")
    print("=" * 80)
    for result in results:
        status = "✅ PASS" if result.get('is_valid', False) else "❌ FAIL"
        error = f" - Error: {result.get('error')}" if 'error' in result else ""
        print(f"{status} | {result['user']} (Cluster {result['cluster']}){error}")

if __name__ == "__main__":
    print("COMPREHENSIVE TESTING OF DIET RECOMMENDATION MODEL")
    print("================================================")
    print("This script will generate and analyze 7-day meal plans for users with diverse health profiles")
    print("including combined conditions like Diabetes+Hypertension, Prediabetic+Celiac, etc.")
    print("\nEach meal plan includes breakfast, lunch, dinner, and snacks with detailed nutritional analysis.")
    print("\nStarting tests...\n")
    test_meal_plan_generation()
