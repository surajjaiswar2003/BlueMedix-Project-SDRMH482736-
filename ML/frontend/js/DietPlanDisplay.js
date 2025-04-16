// Diet Plan Display Component
function DietPlanDisplay({ dietPlan, onBack }) {
  if (!dietPlan || !dietPlan.days) {
    return (
      <div className="diet-plan text-center">
        <h3>No diet plan available</h3>
        <button className="btn btn-primary mt-3" onClick={onBack}>
          Back to Parameters
        </button>
      </div>
    );
  }

  return (
    <div className="diet-plan">
      <h2 className="text-center mb-4">Your 7-Day Personalized Diet Plan</h2>

      {dietPlan.days.map((day, dayIndex) => (
        <div key={dayIndex} className="day-card">
          <div className="day-header">
            <h3>Day {day.day}</h3>
          </div>
          <div className="p-3">
            {day.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className="meal-card">
                <div className="meal-header">
                  <div className="meal-type">{meal.meal_type}</div>
                  <div className="meal-timing">{meal.timing}</div>
                </div>

                <h4 className="recipe-name">{meal.recipe_name}</h4>

                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-2">
                      <strong>Ingredients:</strong> {meal.ingredients}
                    </div>
                    <div>
                      <strong>Instructions:</strong> {meal.instructions}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="nutrition-facts">
                      <span className="nutrition-badge calories">
                        {meal.calories} kcal
                      </span>
                      <span className="nutrition-badge protein">
                        {meal.proteins}g protein
                      </span>
                      <span className="nutrition-badge carbs">
                        {meal.carbs}g carbs
                      </span>
                      <span className="nutrition-badge fat">
                        {meal.fats}g fat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {day.daily_totals && (
              <div className="daily-totals">
                <strong>Daily Totals:</strong> {day.daily_totals.calories} kcal,
                {day.daily_totals.proteins}g protein,
                {day.daily_totals.carbs}g carbs,
                {day.daily_totals.fats}g fat
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="back-button">
        <button className="btn btn-primary" onClick={onBack}>
          Back to Parameters
        </button>
      </div>
    </div>
  );
}
