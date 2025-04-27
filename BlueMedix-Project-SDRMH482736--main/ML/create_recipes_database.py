import pandas as pd
import sqlite3
import os
import sys

def create_recipes_database():
    # Define file paths
    csv_file_path = 'data/recipes.csv'
    db_file_path = 'data/recipes_second.db'
    
    # Check if the CSV file exists
    if not os.path.exists(csv_file_path):
        print(f"Error: The file '{csv_file_path}' does not exist.")
        print("Please make sure the recipes.csv file is in the data folder.")
        return False
    
    try:
        # Load the recipes.csv file
        print(f"Loading recipes from {csv_file_path}...")
        recipes_df = pd.read_csv(csv_file_path)
        
        # Display basic info about the data
        print(f"Found {len(recipes_df)} recipes with {len(recipes_df.columns)} attributes.")
        
        # Connect to SQLite database (or create it if it doesn't exist)
        print(f"Creating/connecting to database at {db_file_path}...")
        connection = sqlite3.connect(db_file_path)
        
        # Store the recipes DataFrame into the database
        print("Importing recipes into database...")
        recipes_df.to_sql('recipes', connection, if_exists='replace', index=False)
        
        # Verify the data was stored correctly
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM recipes")
        row_count = cursor.fetchone()[0]
        
        # Display some basic database info
        cursor.execute("PRAGMA table_info(recipes)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # Close the connection
        connection.close()
        
        print(f"\nSuccess! Stored {row_count} recipes into the database.")
        print(f"Database created at: {os.path.abspath(db_file_path)}")
        print(f"Table name: recipes")
        print(f"Columns: {', '.join(column_names[:5])}... (and {len(column_names)-5} more)")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Starting recipes database creation...")
    create_recipes_database()
