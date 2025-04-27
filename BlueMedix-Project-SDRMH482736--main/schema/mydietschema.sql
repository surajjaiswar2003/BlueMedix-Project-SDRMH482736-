CREATE DATABASE IF NOT EXISTS MyDiet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE MyDiet;


-- Roles (Admin/DataScientist, Dietitian, User)

DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  role_id     INT AUTO_INCREMENT PRIMARY KEY,
  role_name   VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- Users

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id     INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Link users to roles (many-to-many)
DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles (
  user_id  INT NOT NULL,
  role_id  INT NOT NULL,
  PRIMARY KEY (user_id,role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- User Profile (stores the 40 parameters)

DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
  user_id                               INT PRIMARY KEY,

  -- A. Health Conditions
  diabetes                              ENUM('Type1','Type2','None')         NOT NULL,
  hypertension                          BOOLEAN                             NOT NULL,
  cardiovascular                        ENUM('Present','Absent')            NOT NULL,
  digestive_disorder                    ENUM('IBS','Celiac','Non-IBS')      NOT NULL,
  food_allergies                        SET('Nuts','Dairy','Shellfish')     NOT NULL DEFAULT '',

  -- B. BMI Related
  height_cm                             DECIMAL(5,2)                        NOT NULL,
  weight_kg                             DECIMAL(5,2)                        NOT NULL,
  bmi_category                          ENUM('Underweight','Normal','Overweight','Obese') NOT NULL,
  target_weight_kg                      DECIMAL(5,2)                        NULL,
  weight_change_history                 ENUM('Stable','Fluctuating')        NOT NULL,

  -- C. Physical Activity
  exercise_frequency_per_week           TINYINT UNSIGNED                    NOT NULL,
  exercise_duration_min                 SMALLINT UNSIGNED                   NOT NULL,
  exercise_type                         ENUM('Cardio','Strength','Mixed','None') NOT NULL,
  daily_steps_count                     INT                                 NOT NULL,
  job_activity_level                    ENUM('Sedentary','Moderate','Active') NOT NULL,

  -- D. Lifestyle
  work_schedule                         ENUM('Regular','Shift','Flexible')  NOT NULL,
  sleep_duration_hours                  DECIMAL(4,2)                        NOT NULL,
  sleep_quality                         ENUM('Poor','Fair','Good')          NOT NULL,
  stress_level                          ENUM('Low','Medium','High')         NOT NULL,
  meal_timing_regularity                ENUM('Regular','Irregular')         NOT NULL,
  cooking_skills                        ENUM('Basic','Intermediate','Advanced') NOT NULL,
  available_cooking_time_min            SMALLINT UNSIGNED                   NOT NULL,
  food_budget                           ENUM('Low','Medium','High')         NOT NULL,
  alcohol_consumption                   ENUM('None','Occasional','Regular') NOT NULL,
  smoking_status                        ENUM('Non-smoker','Smoker','Former') NOT NULL,
  water_intake_glasses_per_day          TINYINT UNSIGNED                    NOT NULL,
  eating_out_frequency_per_week         TINYINT UNSIGNED                    NOT NULL,
  snacking_behavior                     ENUM('Regular','Average','Irregular') NOT NULL,
  food_prep_time_availability_min       SMALLINT UNSIGNED                   NOT NULL,
  travel_frequency                      ENUM('Rarely','Monthly','Weekly')   NOT NULL,

  -- E. Dietary Preferences & Restrictions
  diet_type                             ENUM('Vegetarian','Vegan','Non-spicy','Pescatarian','Omnivore') NOT NULL,
  meal_size_preference                  ENUM('Small frequent','Regular 3 meals','Large infrequent') NOT NULL,
  spice_tolerance                       ENUM('Low','Medium','High')         NOT NULL,
  cuisine_preferences                   VARCHAR(100)                       NOT NULL,
  texture_preferences                   ENUM('Soft','Crunchy','Mixed')      NOT NULL,
  portion_control_ability               ENUM('Good','Fair','Poor')          NOT NULL,
  previous_diet_success                 BOOLEAN                             NOT NULL,
  food_intolerances                     SET('Lactose','Gluten')             NOT NULL DEFAULT '',
  preferred_meal_complexity             ENUM('Simple','Moderate','Complex') NOT NULL,
  seasonal_food_preferences             BOOLEAN                             NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Daily Logs

DROP TABLE IF EXISTS daily_logs;
CREATE TABLE daily_logs (
  log_id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  log_date       DATE        NOT NULL,
  sleep_hours    DECIMAL(4,2),
  exercise_min   SMALLINT UNSIGNED,
  water_glasses  TINYINT UNSIGNED,
  stress_level   ENUM('Low','Medium','High'),
  mood           VARCHAR(50),
  food_intake    TEXT,
  created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY (user_id, log_date),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Recipes Master Dataset (from recipes.csv made by utsab)

DROP TABLE IF EXISTS recipes;
CREATE TABLE recipes (
  recipe_id           INT               PRIMARY KEY,
  name                VARCHAR(255)      NOT NULL,
  meal_type           ENUM('Breakfast','Lunch','Dinner','Snack') NOT NULL,
  protein             DECIMAL(6,2)      NOT NULL,
  carbs               DECIMAL(6,2)      NOT NULL,
  fat                 DECIMAL(6,2)      NOT NULL,
  calories            INT               NOT NULL,
  sodium              INT               NOT NULL,
  fiber               DECIMAL(6,2)      NOT NULL,
  ingredients         TEXT              NOT NULL,
  instructions        TEXT              NOT NULL,
  vegetarian          BOOLEAN           NOT NULL,
  vegan               BOOLEAN           NOT NULL,
  gluten_free         BOOLEAN           NOT NULL,
  diabetes_friendly   BOOLEAN           NOT NULL,
  heart_healthy       BOOLEAN           NOT NULL,
  low_sodium          BOOLEAN           NOT NULL,
  diet_type           VARCHAR(100)      NOT NULL,
  cooking_difficulty  ENUM('Easy','Medium','Hard') NOT NULL,
  prep_time           SMALLINT UNSIGNED NOT NULL,
  created_by          INT,
  created_at          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


-- Diet Plans & Items

DROP TABLE IF EXISTS diet_plan_items;
CREATE TABLE diet_plans (
  plan_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  generated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status         ENUM('Review','Approved','Rejected') NOT NULL DEFAULT 'Review',
  dietitian_id   INT,
  reviewed_at    DATETIME,
  feedback       TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (dietitian_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE diet_plan_items (
  item_id        INT AUTO_INCREMENT PRIMARY KEY,
  plan_id        INT NOT NULL,
  recipe_id      INT NOT NULL,
  meal_time      ENUM('Breakfast','Lunch','Dinner','Snack') NOT NULL,
  portion_size   VARCHAR(50),
  FOREIGN KEY (plan_id)   REFERENCES diet_plans(plan_id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
) ENGINE=InnoDB;

-- Weekly / Monthly Averages

DROP TABLE IF EXISTS parameter_averages;
CREATE TABLE parameter_averages (
  avg_id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  period_start   DATE NOT NULL,
  period_type    ENUM('Weekly','Monthly','Quarterly','Yearly') NOT NULL,
  avg_steps      DECIMAL(6,2),
  avg_sleep      DECIMAL(5,2),
  avg_water      DECIMAL(5,2),
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- AI Suggestions & Motivational Tips

DROP TABLE IF EXISTS suggestions;
CREATE TABLE suggestions (
  suggestion_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  suggestion_date DATE      NOT NULL,
  content        TEXT      NOT NULL,
  created_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Chat Messages (User ↔ Dietitian)
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  message_id     INT AUTO_INCREMENT PRIMARY KEY,
  from_user_id   INT NOT NULL,
  to_user_id     INT NOT NULL,
  sent_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content        TEXT    NOT NULL,
  FOREIGN KEY (from_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id)   REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Populate default roles
INSERT INTO roles (role_name) VALUES
  ('Admin+DataScientist'),
  ('Dietitian'),
  ('RegisteredUser');
