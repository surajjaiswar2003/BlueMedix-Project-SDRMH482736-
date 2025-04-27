# BlueMedix Project Documentation

## Project Overview
This documentation covers the machine learning component of the BlueMedix project, focusing on recipe recommendation and user data analysis.

## Data Files
The project utilizes the following data files:
1. `recipes.csv` - Contains detailed recipe information
2. `recipes_second.db` - SQLite database with additional recipe data
3. `user_data.csv` - Contains user profile and health information

## Data Preprocessing
The data preprocessing module (`data_preprocessing.py`) handles:
- Loading data from multiple sources (CSV and SQLite)
- Feature engineering and preprocessing
- Data validation and cleaning
- Creating derived features
- Saving processed data for model training

## Model Training
The training script (`train_model_with_report.py`) implements three main models:

### 1. Recipe Clustering Model
- Purpose: Group similar recipes based on nutritional and dietary characteristics
- Features used:
  - Nutritional: protein, carbs, fat, calories, sodium, fiber
  - Dietary: vegetarian, vegan, gluten-free, diabetes-friendly, heart-healthy, low-sodium
- Performance: Silhouette score of 0.214 (moderate clustering structure)

### 2. User Clustering Model
- Purpose: Group users with similar health profiles and preferences
- Features used:
  - Health metrics: Height, Weight, Exercise Frequency, Exercise Duration
  - Lifestyle: Daily Steps Count, Sleep Duration, Water Intake
  - Preferences: BMI Category, Diet Type, Meal Size Preference
- Performance: Silhouette score of 0.063 (weak clustering structure)

### 3. Meal Type Classification Model
- Purpose: Predict meal type (breakfast, lunch, dinner)
- Performance:
  - Perfect accuracy (1.00) across all meal types
  - Successfully classified all test samples
  - High precision and recall for all categories

## Model Outputs
The trained models are saved in the following locations:
- `models/recipe_clustering_model.pkl`
- `models/user_clustering_model.pkl`
- `models/meal_classification_model.pkl`

## Reports and Analysis
Generated reports are stored in the `reports` directory:
1. `clustering_report.txt`
   - Recipe Clustering Silhouette Score: 0.214
   - User Clustering Silhouette Score: 0.063

2. `classification_report.txt`
   - Perfect accuracy for meal type prediction
   - Detailed metrics for each meal type category

3. Clustering Results
   - `recipe_clusters.csv`: Recipe clustering assignments
   - `user_clusters.csv`: User clustering assignments

## Key Findings
1. Recipe Clustering:
   - Moderate clustering structure indicates some natural grouping of recipes
   - Recipes can be effectively grouped by nutritional and dietary characteristics

2. User Clustering:
   - Weak clustering structure suggests continuous rather than categorical user profiles
   - User preferences and health parameters show high variability

3. Meal Type Classification:
   - Excellent performance in meal type prediction
   - Clear distinction between different meal types based on characteristics

## Next Steps
Potential areas for improvement:
1. Enhance user clustering by:
   - Feature selection and engineering
   - Trying alternative clustering algorithms
   - Adjusting the number of clusters

2. Recipe recommendation system:
   - Implement content-based filtering
   - Add collaborative filtering capabilities
   - Integrate with user preferences

3. Model integration:
   - Connect with the backend API
   - Implement real-time recommendations
   - Add user feedback mechanisms

## Usage
To run the training pipeline:
```bash
cd ML
python train_model_with_report.py
```

This will:
1. Load and preprocess the data
2. Train all models
3. Generate performance reports
4. Save models and results

## Dependencies
- Python 3.x
- pandas
- numpy
- scikit-learn
- sqlite3
- joblib

## Notes
- The models are trained on the available dataset and may need retraining as new data becomes available
- Regular model evaluation and updates are recommended
- Consider implementing A/B testing for recommendation algorithms 