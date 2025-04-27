// Main App Component
function App() {
  const [dietPlan, setDietPlan] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (parameters) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-diet",
        parameters
      );
      setDietPlan(response.data.plan);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate diet plan");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setDietPlan(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Diet Recommendation System</h1>
        <p>Get a personalized 7-day meal plan based on your health profile</p>
      </header>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Generating your personalized diet plan...</p>
        </div>
      ) : (
        <>
          {dietPlan ? (
            <DietPlanDisplay dietPlan={dietPlan} onBack={handleBack} />
          ) : (
            <ParameterForm onSubmit={handleSubmit} />
          )}
        </>
      )}
    </div>
  );
}

// Render the App component to the DOM
ReactDOM.render(<App />, document.getElementById("root"));
