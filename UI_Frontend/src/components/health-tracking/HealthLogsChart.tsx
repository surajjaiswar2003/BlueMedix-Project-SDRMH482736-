import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthLogsChartProps {
  logs: any[];
}

const HealthLogsChart: React.FC<HealthLogsChartProps> = ({ logs }) => {
  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Transform data for the chart
  const chartData = sortedLogs.map(log => ({
    date: format(new Date(log.date), 'MMM dd'),
    calories: log.dailyNutritionTotals?.calories || 0,
    protein: log.dailyNutritionTotals?.protein || 0,
    carbs: log.dailyNutritionTotals?.carbs || 0,
    fat: log.dailyNutritionTotals?.fat || 0,
    sleep: log.sleep?.hours || 0,
    water: log.water?.glasses || 0,
    exercise: log.exercise?.minutes || 0,
    stress: log.stress?.level || 0,
    mood: log.mood?.rating || 0
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="calories"
                stroke="#8884d8"
                name="Calories"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="protein"
                stroke="#82ca9d"
                name="Protein (g)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="carbs"
                stroke="#ffc658"
                name="Carbs (g)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fat"
                stroke="#ff8042"
                name="Fat (g)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleep"
                stroke="#0088fe"
                name="Sleep (hrs)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="water"
                stroke="#00C49F"
                name="Water (glasses)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="exercise"
                stroke="#FFBB28"
                name="Exercise (mins)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="stress"
                stroke="#FF8042"
                name="Stress Level"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mood"
                stroke="#8884d8"
                name="Mood Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthLogsChart; 