import { useEffect, useState } from "react";
import { api } from "~/root";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AgeData = {
  age: number;
  goodSleep: number;
  badSleep: number;
};

type GenderData = {
  gender: string;
  goodSleep: number;
  badSleep: number;
};

type AgeResponse = {
  data: AgeData[];
};

type GenderResponse = {
  data: GenderData[];
};

export default function SleepCharts() {
  const [ageData, setAgeData] = useState<AgeData[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ageResponse, genderResponse] = await Promise.all([
          api.get<AgeResponse>("/sleep/tracker/get-sleep-qualities-by-age"),
          api.get<GenderResponse>("/sleep/tracker/get-sleep-qualities-by-gender"),
        ]);

        setAgeData(ageResponse.data.data);
        setGenderData(genderResponse.data.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to load sleep data"
          );
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          Loading sleep data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10 py-10">
      {/* Header */}
 
    <p className="font-bold text-4xl text-center text-white">
        Overview of good and bad sleep based on age and gender.
    </p>
    

      {/* Charts */}
      <div className="flex w-full flex-col lg:flex-row gap-6 px-10">
        {/* Age Chart */}
        <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-900">
              Sleep Quality by Age
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Number of users by age group
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="age"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="goodSleep"
                  name="Good Sleep"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="badSleep"
                  name="Bad Sleep"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-900">
              Sleep Quality by Gender
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Number of users by gender
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genderData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="gender"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="goodSleep"
                  name="Good Sleep"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="badSleep"
                  name="Bad Sleep"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}