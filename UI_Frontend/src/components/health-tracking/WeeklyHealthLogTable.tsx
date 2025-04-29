import React from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WeeklyHealthLogTableProps {
  logs: any[];
  onView: (log: any) => void;
}

const WeeklyHealthLogTable: React.FC<WeeklyHealthLogTableProps> = ({
  logs,
  onView,
}) => {
  const navigate = useNavigate();

  // Get current week's days (Monday to Sunday)
  const getWeekDays = (date = new Date()) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();

  // For each day, find the log (if any) using isSameDay for robust local comparison
  const weekLogs = weekDays.map((day) => {
    const foundLog = logs.find((log) => {
      const logDate = new Date(log.date);
      const result = isSameDay(logDate, day);
      // Debug:
      // console.log(
      //   "Comparing:",
      //   logDate.toISOString(),
      //   "vs",
      //   day.toISOString(),
      //   "=>",
      //   result
      // );
      return result;
    });
    return {
      date: day,
      log: foundLog,
    };
  });

  // Helper function to render rating as stars
  const renderRating = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Helper function to check if a meal has data
  const hasMealData = (meal: any) => meal && meal.name;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">This Week's Health Logs</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Diet</TableHead>
            <TableHead>Sleep</TableHead>
            <TableHead>Exercise</TableHead>
            <TableHead>Water</TableHead>
            <TableHead>Stress</TableHead>
            <TableHead>Mood</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weekLogs.map(({ date, log }) => (
            <TableRow key={format(date, "yyyy-MM-dd")}>
              <TableCell className="font-medium">
                {format(date, "EEE, MMM d")}
              </TableCell>
              <TableCell>
                {log ? (
                  <div className="space-y-1 text-sm">
                    {hasMealData(log.breakfast) && (
                      <div>B: {log.breakfast.name}</div>
                    )}
                    {hasMealData(log.lunch) && <div>L: {log.lunch.name}</div>}
                    {hasMealData(log.dinner) && <div>D: {log.dinner.name}</div>}
                    {hasMealData(log.afternoonSnack) && (
                      <div>AS: {log.afternoonSnack.name}</div>
                    )}
                    {hasMealData(log.eveningSnack) && (
                      <div>ES: {log.eveningSnack.name}</div>
                    )}
                    <div className="font-medium">
                      {log.dailyNutritionTotals?.calories || 0} cal
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log?.sleep ? (
                  <div className="text-sm">{log.sleep.hours} hours</div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log?.exercise ? (
                  <div className="space-y-1 text-sm">
                    <div>{log.exercise.minutes} mins</div>
                    <div className="capitalize">{log.exercise.type}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log?.water ? (
                  <div className="text-sm">{log.water.glasses} glasses</div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log?.stress ? (
                  <div className="text-sm">
                    {renderRating(log.stress.level)}
                  </div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log?.mood ? (
                  <div className="text-sm">{renderRating(log.mood.rating)}</div>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </TableCell>
              <TableCell>
                {log ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(log)}
                  >
                    View
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/user/track/add?date=${format(date, "yyyy-MM-dd")}`
                      )
                    }
                  >
                    Add
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeeklyHealthLogTable;
