from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import random

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():
    return {"message": "Root path works!"}


@app.get("/test")
async def test_route():
    return {"message": "Test route works!"}

@app.post("/api/generate_diet_plan")
async def generate_diet_plan_api(user_params: Dict[str, Any]):
    print(f"Received parameters: {user_params}")
    
    # Generate mock diet plan data
    diet_plan = {}
    for day in range(1, 8):  # 7 days
        diet_plan[f"Day {day}"] = {
            "Breakfast": {
                "name": f"Sample Breakfast {day}",
                "calories": random.randint(300, 500),
                "protein": random.randint(15, 30),
                "carbs": random.randint(30, 60),
                "fat": random.randint(10, 20),
                "sodium": random.randint(200, 500),
                "fiber": random.randint(3, 8)
            },
            "Lunch": {
                "name": f"Sample Lunch {day}",
                "calories": random.randint(500, 700),
                "protein": random.randint(25, 40),
                "carbs": random.randint(50, 80),
                "fat": random.randint(15, 30),
                "sodium": random.randint(400, 800),
                "fiber": random.randint(5, 10)
            },
            "Dinner": {
                "name": f"Sample Dinner {day}",
                "calories": random.randint(600, 800),
                "protein": random.randint(30, 45),
                "carbs": random.randint(60, 90),
                "fat": random.randint(20, 35),
                "sodium": random.randint(500, 900),
                "fiber": random.randint(6, 12)
            }
        }
    
    # Mock nutritional analysis
    nutritional_analysis = {
        "avg_nutrition": {
            "calories": 1800,
            "protein": 90,
            "carbs": 200,
            "fat": 60,
            "sodium": 1500,
            "fiber": 25
        },
        "macro_percentages": {
            "protein_pct": 20,
            "carbs_pct": 55,
            "fat_pct": 25
        },
        "variety_metrics": {
            "unique_recipes": 18,
            "total_meals": 21,
            "variety_score": 85.7
        },
        "meal_coverage": 100
    }
    
    return {
        "success": True,
        "diet_plan": diet_plan,
        "user_cluster": 2,  # Mock cluster
        "nutritional_analysis": nutritional_analysis
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run("app_mock:app", host="0.0.0.0", port=5000, reload=True)
