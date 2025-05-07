import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import HealthLogsChart from "@/components/health-tracking/HealthLogsChart";
import axios from "axios";

const PatientLogsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [healthParams, setHealthParams] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch logs
        const logsRes = await axios.get(
          `http://localhost:5000/api/health-logs/${id}`
        );
        setLogs(Array.isArray(logsRes.data.logs) ? logsRes.data.logs : []);
      } catch (err) {
        setLogs([]);
      }
      try {
        // Fetch patient info (name/email)
        const userRes = await axios.get(
          `http://localhost:5000/api/auth/user/${id}`
        );
        setPatient(userRes.data.user);
      } catch (err) {
        setPatient(null);
      }
      try {
        // Fetch health parameters
        const paramsRes = await axios.get(
          `http://localhost:5000/api/health-parameters/${id}`
        );
        setHealthParams(paramsRes.data);
      } catch (err) {
        setHealthParams(null);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 mt-16">
        <h1 className="text-2xl font-bold mb-2">
          {patient
            ? `${patient.firstName} ${patient.lastName}'s Health Logs`
            : "Patient Health Logs"}
        </h1>
        {healthParams && (
          <Card className="mb-6 p-4">
            <h2 className="text-lg font-semibold mb-2">Health Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Diabetes:</strong> {healthParams.diabetes}
              </div>
              <div>
                <strong>Hypertension:</strong> {healthParams.hypertension}
              </div>
              <div>
                <strong>Cardiovascular:</strong> {healthParams.cardiovascular}
              </div>
              <div>
                <strong>Height:</strong> {healthParams.height} cm
              </div>
              <div>
                <strong>Weight:</strong> {healthParams.weight} kg
              </div>
              <div>
                <strong>BMI Category:</strong> {healthParams.bmiCategory}
              </div>
              <div>
                <strong>Target Weight:</strong> {healthParams.targetWeight} kg
              </div>
              <div>
                <strong>Exercise Freq:</strong> {healthParams.exerciseFrequency}{" "}
                days/week
              </div>
              <div>
                <strong>Diet Type:</strong> {healthParams.dietType}
              </div>
            </div>
          </Card>
        )}
        {isLoading ? (
          <div>Loading...</div>
        ) : Array.isArray(logs) && logs.length === 0 ? (
          <div>No logs found for this patient.</div>
        ) : (
          <>
            <HealthLogsChart logs={logs} />
            {logs.map((log, idx) => (
              <Card key={idx} className="mb-4 p-4">
                <div className="font-semibold mb-2">
                  {log.date ? new Date(log.date).toLocaleDateString() : "No Date"}
                </div>
                <div>
                  <strong>Breakfast:</strong> {log.breakfast?.name || "-"} (
                  {log.breakfast?.calories || 0} cal)
                </div>
                <div>
                  <strong>Lunch:</strong> {log.lunch?.name || "-"} (
                  {log.lunch?.calories || 0} cal)
                </div>
                <div>
                  <strong>Dinner:</strong> {log.dinner?.name || "-"} (
                  {log.dinner?.calories || 0} cal)
                </div>
                <div>
                  <strong>Afternoon Snack:</strong>{" "}
                  {log.afternoonSnack?.name || "-"} (
                  {log.afternoonSnack?.calories || 0} cal)
                </div>
                <div>
                  <strong>Evening Snack:</strong> {log.eveningSnack?.name || "-"}{" "}
                  ({log.eveningSnack?.calories || 0} cal)
                </div>
                <div>
                  <strong>Sleep:</strong> {log.sleep?.hours || "-"} hours
                </div>
                <div>
                  <strong>Exercise:</strong> {log.exercise?.minutes || "-"} min (
                  {log.exercise?.type || "-"})
                </div>
                <div>
                  <strong>Water:</strong> {log.water?.glasses || "-"} glasses
                </div>
                <div>
                  <strong>Mood:</strong> {log.mood?.rating || "-"}
                </div>
                <div>
                  <strong>Stress:</strong> {log.stress?.level || "-"}
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default PatientLogsPage;
