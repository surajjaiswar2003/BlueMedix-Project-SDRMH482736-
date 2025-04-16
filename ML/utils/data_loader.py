import sqlite3
import pandas as pd
import os
import random

class DataLoader:
    def __init__(self):
        """Initialize the data loader"""
        self.db_path = 'enhanced_diet_recommendation.db'
        
    def create_database(self):
        """Create a new SQLite database with enhanced schema for diet recommendation system"""
        # Connect to SQLite database (will be created if it doesn't exist)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Drop existing tables if they exist
        cursor.execute("DROP TABLE IF EXISTS users")
        cursor.execute("DROP TABLE IF EXISTS ingredients")
        cursor.execute("DROP TABLE IF EXISTS recipes")
        cursor.execute("DROP TABLE IF EXISTS recipe_ingredients")
        cursor.execute("DROP TABLE IF EXISTS health_restrictions")
        cursor.execute("DROP TABLE IF EXISTS meal_sequencing")
        cursor.execute("DROP TABLE IF EXISTS user_meal_plans")
        
        # Create users table
        cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            diabetes TEXT,
            hypertension TEXT,
            cardiovascular TEXT,
            digestive_disorder TEXT,
            food_allergies TEXT,
            height REAL,
            weight REAL,
            bmi_category TEXT,
            target_weight REAL,
            weight_change_history TEXT,
            exercise_frequency INTEGER,
            exercise_duration INTEGER,
            exercise_type TEXT,
            daily_steps INTEGER,
            physical_job_activity TEXT,
            work_schedule TEXT,
            sleep_duration INTEGER,
            sleep_quality TEXT,
            stress_level TEXT,
            meal_timing_regularity TEXT,
            cooking_skills TEXT,
            available_cooking_time INTEGER,
            food_budget TEXT,
            alcohol_consumption TEXT,
            smoking_status TEXT,
            water_intake INTEGER,
            eating_out_frequency INTEGER,
            snacking_behavior TEXT,
            food_prep_time INTEGER,
            travel_frequency TEXT,
            diet_type TEXT,
            meal_size_preference TEXT,
            spice_tolerance TEXT,
            cuisine_preferences TEXT,
            food_texture_preferences TEXT,
            portion_control_ability TEXT,
            previous_diet_success TEXT,
            food_intolerances TEXT,
            preferred_meal_complexity TEXT,
            seasonal_food_preferences TEXT
        )
        ''')
        
        # Create enhanced ingredients table
        cursor.execute('''
        CREATE TABLE ingredients (
            id INTEGER PRIMARY KEY,
            name TEXT,
            food_group TEXT,
            calories REAL,
            protein REAL,
            carbs REAL,
            total_fat REAL,
            saturated_fat REAL,
            unsaturated_fat REAL,
            trans_fat REAL,
            cholesterol REAL,
            fiber REAL,
            sugar REAL,
            sodium REAL,
            potassium REAL,
            calcium REAL,
            iron REAL,
            magnesium REAL,
            vitamin_a REAL,
            vitamin_c REAL,
            vitamin_d REAL,
            vitamin_b12 REAL,
            glycemic_index INTEGER,
            glycemic_load INTEGER,
            fodmap_level TEXT,
            insulin_index INTEGER,
            contains_gluten INTEGER,
            contains_dairy INTEGER,
            contains_nuts INTEGER,
            contains_shellfish INTEGER,
            contains_eggs INTEGER,
            contains_soy INTEGER,
            contains_fish INTEGER,
            contains_wheat INTEGER,
            flavor_profile TEXT,
            texture TEXT,
            spice_level INTEGER,
            average_cost REAL,
            seasonal_availability TEXT,
            prep_time INTEGER,
            vegetarian INTEGER,
            vegan INTEGER,
            pescatarian INTEGER,
            keto_friendly INTEGER,
            paleo_friendly INTEGER,
            diabetes_friendly INTEGER,
            heart_healthy INTEGER,
            kidney_friendly INTEGER,
            liver_friendly INTEGER,
            cuisine_origins TEXT,
            breakfast_friendly INTEGER,
            lunch_friendly INTEGER,
            dinner_friendly INTEGER,
            snack_friendly INTEGER,
            sleep_impact TEXT,
            stress_impact TEXT
        )
        ''')

        # Create enhanced recipes table
        cursor.execute('''
        CREATE TABLE recipes (
            id INTEGER PRIMARY KEY,
            name TEXT,
            instructions TEXT,
            prep_time INTEGER,
            cook_time INTEGER,
            complexity TEXT,
            cuisine_type TEXT,
            meal_type TEXT,
            calories REAL,
            protein REAL,
            carbs REAL,
            fats REAL,
            is_vegetarian INTEGER,
            is_vegan INTEGER,
            is_gluten_free INTEGER,
            is_dairy_free INTEGER,
            diabetes_friendly INTEGER,
            hypertension_friendly INTEGER,
            heart_healthy INTEGER,
            low_fodmap INTEGER,
            renal_friendly INTEGER,
            glycemic_impact REAL,
            dash_diet_score REAL,
            anti_inflammatory_score REAL,
            omega3_content REAL,
            fiber_content REAL,
            prep_difficulty TEXT,
            equipment_required TEXT,
            batch_cook_friendly INTEGER,
            meal_prep_time INTEGER,
            cost_rating TEXT,
            ingredient_accessibility TEXT,
            flavor_profile TEXT,
            texture_profile TEXT,
            optimal_serving_times TEXT,
            seasonality TEXT,
            satiety_index REAL,
            palatability_score REAL,
            keto_compatible INTEGER,
            paleo_compatible INTEGER,
            vegan_compatible INTEGER,
            energy_density TEXT,
            meal_completeness TEXT,
            estimated_cost REAL,
            serving_temperature TEXT
        )
        ''')

        # Create recipe_ingredients table (junction table)
        cursor.execute('''
        CREATE TABLE recipe_ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER,
            ingredient_id INTEGER,
            quantity REAL,
            unit TEXT,
            FOREIGN KEY (recipe_id) REFERENCES recipes (id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients (id)
        )
        ''')

        # Create enhanced health restrictions table
        cursor.execute('''
        CREATE TABLE health_restrictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            health_condition TEXT,
            severity TEXT,
            food_group TEXT,
            detailed_food_group TEXT,
            quantitative_threshold TEXT,
            meal_timing_recommendation TEXT,
            specific_foods_to_avoid TEXT,
            note TEXT
        )
        ''')

        # Create meal sequencing table
        cursor.execute('''
        CREATE TABLE meal_sequencing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meal_pattern TEXT,
            health_condition TEXT,
            optimal_time_windows TEXT,
            macronutrient_distribution TEXT,
            weekly_variety_requirements TEXT,
            hydration_strategy TEXT,
            carb_distribution TEXT,
            protein_distribution TEXT,
            suitable_work_schedules TEXT
        )
        ''')

        # Create user meal plan table
        cursor.execute('''
        CREATE TABLE user_meal_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT,
            meal_type TEXT,
            recipe_id INTEGER,
            rating INTEGER,
            feedback TEXT,
            post_meal_glucose REAL,
            energy_level INTEGER,
            satiety_duration INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (recipe_id) REFERENCES recipes (id)
        )
        ''')

        # Create indices for faster queries
        cursor.execute('CREATE INDEX idx_recipe_meal_type ON recipes (meal_type)')
        cursor.execute('CREATE INDEX idx_recipe_cuisine ON recipes (cuisine_type)')
        cursor.execute('CREATE INDEX idx_recipe_diabetes ON recipes (diabetes_friendly)')
        cursor.execute('CREATE INDEX idx_recipe_hypertension ON recipes (hypertension_friendly)')
        cursor.execute('CREATE INDEX idx_recipe_heart ON recipes (heart_healthy)')
        cursor.execute('CREATE INDEX idx_recipe_fodmap ON recipes (low_fodmap)')
        cursor.execute('CREATE INDEX idx_recipe_renal ON recipes (renal_friendly)')
        cursor.execute('CREATE INDEX idx_recipe_complexity ON recipes (complexity)')
        cursor.execute('CREATE INDEX idx_ingredient_foodgroup ON ingredients (food_group)')
        cursor.execute('CREATE INDEX idx_ingredient_gi ON ingredients (glycemic_index)')
        cursor.execute('CREATE INDEX idx_health_restriction_condition ON health_restrictions (health_condition)')
        cursor.execute('CREATE INDEX idx_meal_sequencing_condition ON meal_sequencing (health_condition)')
        
        # Commit the changes
        conn.commit()
        conn.close()
        
        print("Database schema created successfully.")
        
    def import_csv_data(self):
        """Load data from CSV files into the SQLite database"""
        conn = sqlite3.connect(self.db_path)
        
        # Load enhanced ingredients data
        try:
            ingredients_df = pd.read_csv('data/enhanced_ingredients.csv')
            ingredients_df.to_sql('ingredients', conn, if_exists='replace', index=False)
            print(f"Loaded {len(ingredients_df)} ingredients into database.")
        except Exception as e:
            print(f"Error loading ingredients: {e}")
        
        # Load enhanced recipes data
        try:
            recipes_df = pd.read_csv('data/enhanced_recipes.csv')
            recipes_df.to_sql('recipes', conn, if_exists='replace', index=False)
            print(f"Loaded {len(recipes_df)} recipes into database.")
        except Exception as e:
            print(f"Error loading recipes: {e}")
        
        # Load health restrictions data
        try:
            health_restrictions_df = pd.read_csv('data/enhanced_health_restrictions.csv')
            health_restrictions_df.to_sql('health_restrictions', conn, if_exists='replace', index=False)
            print(f"Loaded {len(health_restrictions_df)} health restrictions into database.")
        except Exception as e:
            print(f"Error loading health restrictions: {e}")
        
        # Load meal sequencing data
        try:
            meal_sequencing_df = pd.read_csv('data/meal_sequencing.csv')
            meal_sequencing_df.to_sql('meal_sequencing', conn, if_exists='replace', index=False)
            print(f"Loaded {len(meal_sequencing_df)} meal sequencing rules into database.")
        except Exception as e:
            print(f"Error loading meal sequencing: {e}")
        
        # Load user parameters data
        try:
            users_df = pd.read_csv('data/users_parameters.csv')
            users_df.to_sql('users', conn, if_exists='replace', index=False)
            print(f"Loaded {len(users_df)} user profiles into database.")
        except Exception as e:
            print(f"Error loading user parameters: {e}")
        
        # Generate recipe-ingredient associations
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM recipe_ingredients")
            
            recipe_ids = recipes_df['id'].tolist()
            ingredient_ids = ingredients_df['id'].tolist()
            
            recipe_ingredients = []
            for recipe_id in recipe_ids:
                # Randomly select 4-12 ingredients for each recipe
                num_ingredients = random.randint(4, 12)
                selected_ingredients = random.sample(ingredient_ids, min(num_ingredients, len(ingredient_ids)))
                
                for ingredient_id in selected_ingredients:
                    quantity = round(random.uniform(0.1, 5.0), 1)
                    units = random.choice(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece'])
                    recipe_ingredients.append((recipe_id, ingredient_id, quantity, units))
            
            cursor.executemany("INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)", 
                              recipe_ingredients)
            conn.commit()
            print(f"Generated {len(recipe_ingredients)} recipe-ingredient associations.")
        except Exception as e:
            print(f"Error generating recipe ingredients: {e}")
        
        conn.close()
        print("All data loaded successfully.")

    def verify_database(self):
        """Run sample queries to verify database setup"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        print("\n--- Database Verification ---\n")
        
        # Check Type 1 Diabetes restrictions
        cursor.execute("""
        SELECT COUNT(*) FROM health_restrictions 
        WHERE health_condition = 'Diabetes Type 1'
        """)
        diabetes_restrictions = cursor.fetchone()[0]
        print(f"Found {diabetes_restrictions} Type 1 Diabetes restrictions")
        
        # Check diabetes-friendly recipes
        cursor.execute("""
        SELECT COUNT(*) FROM recipes 
        WHERE diabetes_friendly = 1
        """)
        diabetes_recipes = cursor.fetchone()[0]
        print(f"Found {diabetes_recipes} diabetes-friendly recipes")
        
        # Check low-glycemic ingredients
        cursor.execute("""
        SELECT COUNT(*) FROM ingredients 
        WHERE glycemic_index < 55
        """)
        low_gi_ingredients = cursor.fetchone()[0]
        print(f"Found {low_gi_ingredients} low-glycemic ingredients")
        
        conn.close()
