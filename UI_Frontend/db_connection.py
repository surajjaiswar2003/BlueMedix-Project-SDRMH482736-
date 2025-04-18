import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",  # Replace with your MySQL username
            password="your_password",  # Replace with your MySQL password
            database="diet_management_db"  # Your database name from the SQL script
        )
        
        if connection.is_connected():
            return connection
            
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def close_connection(connection, cursor=None):
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()
