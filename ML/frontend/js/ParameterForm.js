// Parameter Form Component
function ParameterForm({ onSubmit }) {
  const [parameters, setParameters] = React.useState({
    // Health conditions
    diabetes: "",
    hypertension: "No",
    cardiovascular: "Absent",
    digestive_disorder: "",
    food_allergies: "",

    // Physical parameters
    height: 170,
    weight: 70,
    age: 35,
    gender: "male",
    bmi_category: "Normal",
    target_weight: 70,
    weight_change_history: "Stable",

    // Activity parameters
    exercise_frequency: 3,
    exercise_duration: 30,
    exercise_type: "Walking",
    daily_steps: 5000,
    physical_job_activity: "Light",

    // Diet preferences
    diet_type: "Non-vegetarian",
    meal_size_preference: "Regular meals",
    cuisine_preferences: "Mixed",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the parent component's onSubmit function
      await onSubmit(parameters);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parameters-form">
      <form onSubmit={handleSubmit}>
        {/* Health Conditions Section */}
        <div className="form-section">
          <h3>Health Conditions</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="diabetes" className="form-label">
                Diabetes
              </label>
              <select
                className="form-select"
                id="diabetes"
                name="diabetes"
                value={parameters.diabetes}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="Prediabetic">Prediabetic</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="hypertension" className="form-label">
                Hypertension
              </label>
              <select
                className="form-select"
                id="hypertension"
                name="hypertension"
                value={parameters.hypertension}
                onChange={handleChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="cardiovascular" className="form-label">
                Cardiovascular Issues
              </label>
              <select
                className="form-select"
                id="cardiovascular"
                name="cardiovascular"
                value={parameters.cardiovascular}
                onChange={handleChange}
              >
                <option value="Absent">Absent</option>
                <option value="Present">Present</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="digestive_disorder" className="form-label">
                Digestive Disorder
              </label>
              <select
                className="form-select"
                id="digestive_disorder"
                name="digestive_disorder"
                value={parameters.digestive_disorder}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="IBS">IBS</option>
                <option value="Celiac">Celiac</option>
                <option value="Non-IBS">Non-IBS</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="food_allergies" className="form-label">
                Food Allergies
              </label>
              <input
                type="text"
                className="form-control"
                id="food_allergies"
                name="food_allergies"
                placeholder="e.g., Nuts, Dairy, Gluten"
                value={parameters.food_allergies}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Physical Parameters Section */}
        <div className="form-section">
          <h3>Physical Parameters</h3>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="height" className="form-label">
                Height (cm)
              </label>
              <input
                type="number"
                className="form-control"
                id="height"
                name="height"
                value={parameters.height}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="weight" className="form-label">
                Weight (kg)
              </label>
              <input
                type="number"
                className="form-control"
                id="weight"
                name="weight"
                value={parameters.weight}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={parameters.age}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={parameters.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="target_weight" className="form-label">
                Target Weight (kg)
              </label>
              <input
                type="number"
                className="form-control"
                id="target_weight"
                name="target_weight"
                value={parameters.target_weight}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-8 mb-3">
              <label htmlFor="weight_change_history" className="form-label">
                Weight Change History
              </label>
              <select
                className="form-select"
                id="weight_change_history"
                name="weight_change_history"
                value={parameters.weight_change_history}
                onChange={handleChange}
              >
                <option value="Stable">Stable</option>
                <option value="Gradual gain">Gradual gain</option>
                <option value="Gradual loss">Gradual loss</option>
                <option value="Fluctuating">Fluctuating</option>
                <option value="Recent significant gain">
                  Recent significant gain
                </option>
                <option value="Recent significant loss">
                  Recent significant loss
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity Parameters Section */}
        <div className="form-section">
          <h3>Activity Parameters</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="exercise_frequency" className="form-label">
                Exercise Frequency (days/week)
              </label>
              <input
                type="number"
                className="form-control"
                id="exercise_frequency"
                name="exercise_frequency"
                min="0"
                max="7"
                value={parameters.exercise_frequency}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="exercise_duration" className="form-label">
                Exercise Duration (minutes)
              </label>
              <input
                type="number"
                className="form-control"
                id="exercise_duration"
                name="exercise_duration"
                value={parameters.exercise_duration}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="exercise_type" className="form-label">
                Exercise Type
              </label>
              <select
                className="form-select"
                id="exercise_type"
                name="exercise_type"
                value={parameters.exercise_type}
                onChange={handleChange}
              >
                <option value="Walking">Walking</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Strength Training">Strength Training</option>
                <option value="Yoga">Yoga</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diet Preferences Section */}
        <div className="form-section">
          <h3>Diet Preferences</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="diet_type" className="form-label">
                Diet Type
              </label>
              <select
                className="form-select"
                id="diet_type"
                name="diet_type"
                value={parameters.diet_type}
                onChange={handleChange}
              >
                <option value="Non-vegetarian">Non-vegetarian</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-vegetarian">Non-vegetarian</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Pescatarian">Pescatarian</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="meal_size_preference" className="form-label">
                Meal Size Preference
              </label>
              <select
                className="form-select"
                id="meal_size_preference"
                name="meal_size_preference"
                value={parameters.meal_size_preference}
                onChange={handleChange}
              >
                <option value="Regular meals">Regular meals</option>
                <option value="Small frequent meals">
                  Small frequent meals
                </option>
                <option value="Large infrequent meals">
                  Large infrequent meals
                </option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="cuisine_preferences" className="form-label">
                Cuisine Preferences
              </label>
              <select
                className="form-select"
                id="cuisine_preferences"
                name="cuisine_preferences"
                value={parameters.cuisine_preferences}
                onChange={handleChange}
              >
                <option value="Mixed">Mixed</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Asian">Asian</option>
                <option value="American">American</option>
                <option value="European">European</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="food_intolerances" className="form-label">
                Food Intolerances
              </label>
              <input
                type="text"
                className="form-control"
                id="food_intolerances"
                name="food_intolerances"
                placeholder="e.g., Lactose, Gluten, FODMAPs"
                value={parameters.food_intolerances || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="spice_tolerance" className="form-label">
                Spice Tolerance
              </label>
              <select
                className="form-select"
                id="spice_tolerance"
                name="spice_tolerance"
                value={parameters.spice_tolerance || "Medium"}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle Parameters Section */}
        <div className="form-section">
          <h3>Lifestyle Parameters</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="sleep_duration" className="form-label">
                Sleep Duration (hours)
              </label>
              <input
                type="number"
                className="form-control"
                id="sleep_duration"
                name="sleep_duration"
                min="3"
                max="12"
                value={parameters.sleep_duration || 7}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="water_intake" className="form-label">
                Water Intake (glasses/day)
              </label>
              <input
                type="number"
                className="form-control"
                id="water_intake"
                name="water_intake"
                min="0"
                max="20"
                value={parameters.water_intake || 8}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="stress_level" className="form-label">
                Stress Level
              </label>
              <select
                className="form-select"
                id="stress_level"
                name="stress_level"
                value={parameters.stress_level || "Moderate"}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="work_schedule" className="form-label">
                Work Schedule
              </label>
              <select
                className="form-select"
                id="work_schedule"
                name="work_schedule"
                value={parameters.work_schedule}
                onChange={handleChange}
              >
                <option value="Regular">Regular (9-5)</option>
                <option value="Shift work">Shift work</option>
                <option value="Flexible">Flexible</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cooking_skills" className="form-label">
                Cooking Skills
              </label>
              <select
                className="form-select"
                id="cooking_skills"
                name="cooking_skills"
                value={parameters.cooking_skills}
                onChange={handleChange}
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-submit">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Generating Diet Plan...
              </>
            ) : (
              "Generate My Diet Plan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
