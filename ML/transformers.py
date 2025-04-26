# transformers.py
from sklearn.base import BaseEstimator, TransformerMixin

class HealthPriorityTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, high_cols=None, medium_cols=None, low_cols=None):
        self.high_cols = high_cols or []
        self.medium_cols = medium_cols or []
        self.low_cols = low_cols or []
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        # Your transformation logic here
        # This should match exactly how it was defined when you created the model
        return X
