import os
import pandas as pd
import numpy as np
import joblib
import sys
from datetime import datetime
from sklearn.metrics import silhouette_score

# Import the report generator
from model_report_generator import ModelReportGenerator

def generate_report_for_clustering_model(model, data, model_path, preprocessor_path=None):
    """
    Generate a report for an existing clustering model.
    
    Args:
        model: Trained clustering model
        data: DataFrame containing the data used for clustering
        model_path: Path to the saved model file
        preprocessor_path: Path to the saved preprocessor file
        
    Returns:
        Path to the generated PDF report
    """
    # Create a reports directory if it doesn't exist
    reports_dir = 'reports'
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
    
    # Initialize the report generator
    report_generator = ModelReportGenerator(output_dir=reports_dir)
    
    # Get cluster assignments
    cluster_assignments = model.predict(data)
    
    # Calculate model metrics
    inertia = model.inertia_
    silhouette_avg = silhouette_score(data, cluster_assignments)
    
    # Create model information dictionary
    model_info = {
        'model_type': 'KMeans',
        'parameters': {
            'n_clusters': model.n_clusters,
            'random_state': model.random_state
        }
    }
    
    # Create cluster information dictionary
    cluster_sizes = {}
    for i in range(model.n_clusters):
        cluster_sizes[i] = np.sum(cluster_assignments == i)
    
    cluster_info = {
        'n_clusters': model.n_clusters,
        'cluster_sizes': cluster_sizes
    }
    
    # Create performance metrics dictionary
    performance_metrics = {
        'inertia': inertia,
        'silhouette_score': silhouette_avg
    }
    
    # Create data information dictionary
    data_info = {
        'train_size': len(data),
        'features': list(data.columns)
    }
    
    # Generate report
    report_path = report_generator.generate_report(
        model_info=model_info,
        data_info=data_info,
        performance_metrics=performance_metrics,
        cluster_info=cluster_info,
        model_path=model_path,
        preprocessor_path=preprocessor_path
    )
    
    return report_path

def generate_report_for_classification_model(model, X, y, model_path, preprocessor_path=None):
    """
    Generate a report for an existing classification model.
    
    Args:
        model: Trained classification model
        X: DataFrame containing the features
        y: Series containing the target variable
        model_path: Path to the saved model file
        preprocessor_path: Path to the saved preprocessor file
        
    Returns:
        Path to the generated PDF report
    """
    # Create a reports directory if it doesn't exist
    reports_dir = 'reports'
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
    
    # Initialize the report generator
    report_generator = ModelReportGenerator(output_dir=reports_dir)
    
    # Make predictions
    y_pred = model.predict(X)
    
    # Calculate model metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average='weighted')
    recall = recall_score(y, y_pred, average='weighted')
    f1 = f1_score(y, y_pred, average='weighted')
    
    # Get feature importance if available
    feature_importance = None
    if hasattr(model, 'feature_importances_'):
        feature_importance = dict(zip(X.columns, model.feature_importances_))
    
    # Create model information dictionary
    model_info = {
        'model_type': model.__class__.__name__,
        'parameters': model.get_params()
    }
    
    # Create performance metrics dictionary
    performance_metrics = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1
    }
    
    # Create data information dictionary
    data_info = {
        'train_size': len(X),
        'features': list(X.columns)
    }
    
    # Generate report
    report_path = report_generator.generate_report(
        model_info=model_info,
        data_info=data_info,
        performance_metrics=performance_metrics,
        feature_importance=feature_importance,
        model_path=model_path,
        preprocessor_path=preprocessor_path
    )
    
    return report_path

def main():
    """
    Main function to generate reports for existing models.
    """
    # Check if models directory exists
    if not os.path.exists('models'):
        print("Error: Models directory not found.")
        print("Please train models first or specify the correct path.")
        sys.exit(1)
    
    # Check if clustering model exists
    clustering_model_path = 'models/clustering_model.pkl'
    if os.path.exists(clustering_model_path):
        print("Loading clustering model...")
        clustering_model = joblib.load(clustering_model_path)
        
        # Load the data
        if os.path.exists('processed_data/enhanced_user_data.csv'):
            print("Loading data...")
            data = pd.read_csv('processed_data/enhanced_user_data.csv')
            data = data.drop(['user_id'], axis=1, errors='ignore')
            
            # Generate clustering report
            print("Generating clustering model report...")
            clustering_report_path = generate_report_for_clustering_model(
                clustering_model, data, clustering_model_path
            )
            print(f"Clustering model report generated: {clustering_report_path}")
        else:
            print("Error: Enhanced user data not found.")
            print("Please run data preprocessing first.")
    else:
        print("Clustering model not found.")
    
    # Check if classification model exists
    classification_model_path = 'models/classification_model.pkl'
    if os.path.exists(classification_model_path):
        print("Loading classification model...")
        classification_model = joblib.load(classification_model_path)
        
        # Load the data
        if os.path.exists('processed_data/enhanced_user_data.csv'):
            print("Loading data...")
            data = pd.read_csv('processed_data/enhanced_user_data.csv')
            
            # Check if target variable exists
            if 'target_variable' in data.columns:
                X = data.drop(['user_id', 'target_variable'], axis=1, errors='ignore')
                y = data['target_variable']
                
                # Generate classification report
                print("Generating classification model report...")
                classification_report_path = generate_report_for_classification_model(
                    classification_model, X, y, classification_model_path
                )
                print(f"Classification model report generated: {classification_report_path}")
            else:
                print("Target variable not found in the data.")
        else:
            print("Error: Enhanced user data not found.")
            print("Please run data preprocessing first.")
    else:
        print("Classification model not found.")
    
    print("Report generation completed!")

if __name__ == "__main__":
    main() 