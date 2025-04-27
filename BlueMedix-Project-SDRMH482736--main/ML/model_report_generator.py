import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from fpdf import FPDF
import joblib
import json
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for PDF generation

class ModelReportGenerator:
    """
    A class to generate comprehensive PDF reports for ML model training.
    This report includes key aspects that should be monitored.
    """
    
    def __init__(self, output_dir='reports'):
        """
        Initialize the report generator.
        
        Args:
            output_dir: Directory to save the generated reports
        """
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
    def generate_report(self, model_info, data_info, performance_metrics, 
                        feature_importance=None, cluster_info=None, 
                        model_path=None, preprocessor_path=None):
        """
        Generate a comprehensive PDF report for the trained model.
        
        Args:
            model_info: Dictionary containing model information (type, parameters, etc.)
            data_info: Dictionary containing information about the training data
            performance_metrics: Dictionary containing model performance metrics
            feature_importance: Dictionary or array of feature importance scores
            cluster_info: Dictionary containing information about clustering (if applicable)
            model_path: Path to the saved model file
            preprocessor_path: Path to the saved preprocessor file
            
        Returns:
            Path to the generated PDF report
        """
        # Create a new PDF document
        pdf = FPDF()
        pdf.add_page()
        
        # Add title
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 10, 'ML Model Training Report', ln=True, align='C')
        pdf.ln(10)
        
        # Add timestamp
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True)
        pdf.ln(5)
        
        # Add model information section
        self._add_section_title(pdf, 'Model Information')
        self._add_model_info(pdf, model_info)
        
        # Add data information section
        self._add_section_title(pdf, 'Data Information')
        self._add_data_info(pdf, data_info)
        
        # Add performance metrics section
        self._add_section_title(pdf, 'Performance Metrics')
        self._add_performance_metrics(pdf, performance_metrics)
        
        # Add feature importance section if available
        if feature_importance is not None:
            self._add_section_title(pdf, 'Feature Importance')
            self._add_feature_importance(pdf, feature_importance)
            
        # Add cluster information section if available
        if cluster_info is not None:
            self._add_section_title(pdf, 'Clustering Information')
            self._add_cluster_info(pdf, cluster_info)
            
        # Add model files section
        self._add_section_title(pdf, 'Model Files')
        self._add_model_files(pdf, model_path, preprocessor_path)
        
        # Add recommendations section
        self._add_section_title(pdf, 'Monitoring Recommendations')
        self._add_monitoring_recommendations(pdf, model_info, performance_metrics)
        
        # Save the PDF
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = os.path.join(self.output_dir, f'model_report_{timestamp}.pdf')
        pdf.output(report_path)
        
        return report_path
    
    def _add_section_title(self, pdf, title):
        """Add a section title to the PDF."""
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, title, ln=True)
        pdf.ln(5)
        
    def _add_model_info(self, pdf, model_info):
        """Add model information to the PDF."""
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Model Type:', ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, str(model_info.get('model_type', 'N/A')), ln=True)
        
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Model Parameters:', ln=True)
        pdf.set_font('Arial', '', 12)
        
        params = model_info.get('parameters', {})
        if params:
            for param, value in params.items():
                pdf.cell(0, 10, f'{param}: {value}', ln=True)
        else:
            pdf.cell(0, 10, 'No parameters available', ln=True)
            
        pdf.ln(5)
        
    def _add_data_info(self, pdf, data_info):
        """Add data information to the PDF."""
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Training Data Size:', ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, f"{data_info.get('train_size', 'N/A')} samples", ln=True)
        
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Features:', ln=True)
        pdf.set_font('Arial', '', 12)
        features = data_info.get('features', [])
        if features:
            for feature in features:
                pdf.cell(0, 10, f'- {feature}', ln=True)
        else:
            pdf.cell(0, 10, 'No feature information available', ln=True)
            
        pdf.ln(5)
        
    def _add_performance_metrics(self, pdf, metrics):
        """Add performance metrics to the PDF."""
        pdf.set_font('Arial', '', 12)
        
        # Add classification metrics if available
        if 'accuracy' in metrics:
            pdf.cell(0, 10, f"Accuracy: {metrics['accuracy']:.4f}", ln=True)
        if 'precision' in metrics:
            pdf.cell(0, 10, f"Precision: {metrics['precision']:.4f}", ln=True)
        if 'recall' in metrics:
            pdf.cell(0, 10, f"Recall: {metrics['recall']:.4f}", ln=True)
        if 'f1_score' in metrics:
            pdf.cell(0, 10, f"F1 Score: {metrics['f1_score']:.4f}", ln=True)
            
        # Add clustering metrics if available
        if 'silhouette_score' in metrics:
            pdf.cell(0, 10, f"Silhouette Score: {metrics['silhouette_score']:.4f}", ln=True)
        if 'inertia' in metrics:
            pdf.cell(0, 10, f"Inertia: {metrics['inertia']:.4f}", ln=True)
            
        # Add custom metrics
        for metric, value in metrics.items():
            if metric not in ['accuracy', 'precision', 'recall', 'f1_score', 'silhouette_score', 'inertia']:
                pdf.cell(0, 10, f"{metric}: {value}", ln=True)
                
        pdf.ln(5)
        
    def _add_feature_importance(self, pdf, feature_importance):
        """Add feature importance information to the PDF."""
        pdf.set_font('Arial', '', 12)
        
        if isinstance(feature_importance, dict):
            for feature, importance in feature_importance.items():
                pdf.cell(0, 10, f"{feature}: {importance:.4f}", ln=True)
        elif isinstance(feature_importance, (list, np.ndarray)):
            for i, importance in enumerate(feature_importance):
                pdf.cell(0, 10, f"Feature {i}: {importance:.4f}", ln=True)
        else:
            pdf.cell(0, 10, "Feature importance information not available in a compatible format", ln=True)
            
        pdf.ln(5)
        
    def _add_cluster_info(self, pdf, cluster_info):
        """Add clustering information to the PDF."""
        pdf.set_font('Arial', '', 12)
        
        if 'n_clusters' in cluster_info:
            pdf.cell(0, 10, f"Number of Clusters: {cluster_info['n_clusters']}", ln=True)
        if 'cluster_sizes' in cluster_info:
            pdf.cell(0, 10, "Cluster Sizes:", ln=True)
            for cluster, size in cluster_info['cluster_sizes'].items():
                pdf.cell(0, 10, f"Cluster {cluster}: {size} samples", ln=True)
                
        pdf.ln(5)
        
    def _add_model_files(self, pdf, model_path, preprocessor_path):
        """Add information about model files to the PDF."""
        pdf.set_font('Arial', '', 12)
        
        if model_path and os.path.exists(model_path):
            pdf.cell(0, 10, f"Model saved at: {model_path}", ln=True)
        else:
            pdf.cell(0, 10, "Model file not found", ln=True)
            
        if preprocessor_path and os.path.exists(preprocessor_path):
            pdf.cell(0, 10, f"Preprocessor saved at: {preprocessor_path}", ln=True)
        else:
            pdf.cell(0, 10, "Preprocessor file not found", ln=True)
            
        pdf.ln(5)
        
    def _add_monitoring_recommendations(self, pdf, model_info, performance_metrics):
        """Add monitoring recommendations to the PDF."""
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Key Aspects to Monitor:', ln=True)
        pdf.set_font('Arial', '', 12)
        
        # Model performance drift
        pdf.cell(0, 10, "1. Model Performance Drift", ln=True)
        pdf.cell(0, 10, "   - Regularly evaluate model performance on new data", ln=True)
        pdf.cell(0, 10, "   - Set up alerts for significant performance degradation", ln=True)
        
        # Data distribution changes
        pdf.cell(0, 10, "2. Data Distribution Changes", ln=True)
        pdf.cell(0, 10, "   - Monitor feature distributions for shifts", ln=True)
        pdf.cell(0, 10, "   - Check for new categories in categorical features", ln=True)
        
        # Feature importance changes
        pdf.cell(0, 10, "3. Feature Importance Changes", ln=True)
        pdf.cell(0, 10, "   - Periodically reassess feature importance", ln=True)
        pdf.cell(0, 10, "   - Investigate if key features change significantly", ln=True)
        
        # Model retraining schedule
        pdf.cell(0, 10, "4. Model Retraining Schedule", ln=True)
        pdf.cell(0, 10, "   - Establish a regular retraining schedule", ln=True)
        pdf.cell(0, 10, "   - Document the impact of each retraining", ln=True)
        
        # Error analysis
        pdf.cell(0, 10, "5. Error Analysis", ln=True)
        pdf.cell(0, 10, "   - Analyze patterns in prediction errors", ln=True)
        pdf.cell(0, 10, "   - Identify subgroups with poor performance", ln=True)
        
        pdf.ln(5)
        
    def generate_visualization(self, data, plot_type, title, filename):
        """
        Generate a visualization and save it to a file.
        
        Args:
            data: Data to visualize
            plot_type: Type of plot to generate
            title: Title of the plot
            filename: Filename to save the plot
            
        Returns:
            Path to the saved visualization
        """
        plt.figure(figsize=(10, 6))
        
        if plot_type == 'histogram':
            plt.hist(data, bins=20)
        elif plot_type == 'bar':
            plt.bar(range(len(data)), data)
        elif plot_type == 'scatter':
            x, y = data
            plt.scatter(x, y)
        elif plot_type == 'line':
            plt.plot(data)
        elif plot_type == 'box':
            plt.boxplot(data)
        elif plot_type == 'heatmap':
            sns.heatmap(data, annot=True, cmap='coolwarm')
        else:
            raise ValueError(f"Unsupported plot type: {plot_type}")
            
        plt.title(title)
        plt.tight_layout()
        
        # Save the plot
        output_path = os.path.join(self.output_dir, filename)
        plt.savefig(output_path)
        plt.close()
        
        return output_path 