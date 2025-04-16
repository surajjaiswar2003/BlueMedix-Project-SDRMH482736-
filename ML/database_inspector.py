# database_inspector.py
import sqlite3
import pandas as pd

def inspect_database(db_path='enhanced_diet_recommendation.db'):
    """Inspect the database structure to understand what's available"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check what tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(f"Tables in database: {[t[0] for t in tables]}")
    
    # Inspect structure of recipes table
    if ('recipes',) in tables:
        cursor.execute("PRAGMA table_info(recipes)")
        columns = cursor.fetchall()
        print(f"\nColumns in recipes table ({len(columns)} total):")
        for i, col in enumerate(columns[:10]):  # Show first 10 columns
            print(f"  {col[1]} ({col[2]})")
        if len(columns) > 10:
            print(f"  ... and {len(columns)-10} more columns")
        
        # Get sample data
        cursor.execute("SELECT * FROM recipes LIMIT 1")
        sample = cursor.fetchone()
        if sample:
            print("\nSample recipe data available")
    
    conn.close()

if __name__ == "__main__":
    inspect_database()
