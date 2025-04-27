# ML Model Training and Report Generation

This directory contains the machine learning models and data preprocessing code for the BlueMedix project. It also includes a new feature to generate comprehensive PDF reports after each model training.

## Model Report Generation

The model report generation feature creates detailed PDF reports that contain key aspects which should be monitored after each model training. These reports include:

1. **Model Information**: Details about the model type, parameters, and configuration
2. **Data Information**: Information about the training data, including size and features
3. **Performance Metrics**: Evaluation metrics for the model
4. **Feature Importance**: For classification models, the importance of each feature
5. **Clustering Information**: For clustering models, details about the clusters
6. **Model Files**: Information about where the model and preprocessor files are saved
7. **Monitoring Recommendations**: Key aspects that should be monitored for model maintenance

## How to Use

### Option 1: Train Models and Generate Reports in One Step

Run the `train_model_with_report.py` script to train models and generate reports in one step:

```bash
python train_model_with_report.py
```

This script will:
1. Load and preprocess the data
2. Train clustering and classification models (if applicable)
3. Generate comprehensive PDF reports for each model
4. Save the reports in the `reports` directory

### Option 2: Generate Reports for Existing Models

If you've already trained models and want to generate reports for them, run the `generate_model_report.py` script:

```bash
python generate_model_report.py
```

This script will:
1. Load existing trained models from the `models` directory
2. Generate comprehensive PDF reports for each model
3. Save the reports in the `reports` directory

### Option 3: Generate Reports from Jupyter Notebook

You can also generate reports directly from your Jupyter notebook by importing the report generation functions:

```python
from generate_model_report import generate_report_for_clustering_model, generate_report_for_classification_model

# For clustering models
report_path = generate_report_for_clustering_model(
    clustering_model, data, 'models/clustering_model.pkl'
)
print(f"Clustering model report generated: {report_path}")

# For classification models
report_path = generate_report_for_classification_model(
    classification_model, X, y, 'models/classification_model.pkl'
)
print(f"Classification model report generated: {report_path}")
```

## Required Dependencies

Make sure you have the following dependencies installed:

```bash
pip install -r requirements.txt
```

The report generation feature requires:
- pandas
- numpy
- scikit-learn
- matplotlib
- seaborn
- fpdf
- tabulate

## Report Structure

Each generated report includes the following sections:

1. **Model Information**
   - Model type
   - Model parameters

2. **Data Information**
   - Training data size
   - Features used

3. **Performance Metrics**
   - For classification models: accuracy, precision, recall, F1 score
   - For clustering models: inertia, silhouette score

4. **Feature Importance** (for classification models)
   - Importance scores for each feature

5. **Clustering Information** (for clustering models)
   - Number of clusters
   - Size of each cluster

6. **Model Files**
   - Paths to saved model and preprocessor files

7. **Monitoring Recommendations**
   - Key aspects to monitor for model maintenance
   - Recommendations for model retraining

## Customizing Reports

You can customize the reports by modifying the `ModelReportGenerator` class in `model_report_generator.py`. This class provides methods to add different sections to the report and generate visualizations.
