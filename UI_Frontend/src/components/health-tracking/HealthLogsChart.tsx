import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Calculate averages
  const averages = {
    calories: Math.round(chartData.reduce((acc, curr) => acc + curr.calories, 0) / chartData.length),
    protein: Math.round(chartData.reduce((acc, curr) => acc + curr.protein, 0) / chartData.length),
    carbs: Math.round(chartData.reduce((acc, curr) => acc + curr.carbs, 0) / chartData.length),
    fat: Math.round(chartData.reduce((acc, curr) => acc + curr.fat, 0) / chartData.length),
    sleep: (chartData.reduce((acc, curr) => acc + curr.sleep, 0) / chartData.length).toFixed(1),
    water: Math.round(chartData.reduce((acc, curr) => acc + curr.water, 0) / chartData.length),
    exercise: Math.round(chartData.reduce((acc, curr) => acc + curr.exercise, 0) / chartData.length),
    stress: (chartData.reduce((acc, curr) => acc + curr.stress, 0) / chartData.length).toFixed(1),
    mood: (chartData.reduce((acc, curr) => acc + curr.mood, 0) / chartData.length).toFixed(1)
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Health Metrics</CardTitle>
        <CardDescription>Track your health progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="calories"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                    name="Calories"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="protein"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorProtein)"
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sleep" name="Sleep (hrs)" fill="#0088fe">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.sleep >= 7 ? "#0088fe" : "#ff8042"} />
                    ))}
                  </Bar>
                  <Bar yAxisId="left" dataKey="water" name="Water (glasses)" fill="#00C49F">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.water >= 8 ? "#00C49F" : "#ff8042"} />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="exercise" name="Exercise (mins)" fill="#FFBB28">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.exercise >= 30 ? "#FFBB28" : "#ff8042"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Daily Calories</h3>
                  <p className="text-2xl font-bold">{averages.calories}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Sleep</h3>
                  <p className="text-2xl font-bold">{averages.sleep} hrs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Water Intake</h3>
                  <p className="text-2xl font-bold">{averages.water} glasses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Exercise</h3>
                  <p className="text-2xl font-bold">{averages.exercise} mins</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Stress Level</h3>
                  <p className="text-2xl font-bold">{averages.stress}/5</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Mood</h3>
                  <p className="text-2xl font-bold">{averages.mood}/5</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthLogsChart; 