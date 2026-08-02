

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { api } from "~/root";


type WeeklyDaily = {
    date: string;
    sleep_duration: number;
    awakenings: number;
    is_good_sleep: boolean;
}

type WeeklySummaryData = {
    average_sleep: number;
    good_days: number;
    poor_days: number;
    average_awakenings: number;
}

type WeeklyReport =  {
    summary: WeeklySummaryData;
    daily: WeeklyDaily[];
}



export default function WeeklySummary() {
    const [data, setData] = useState<WeeklyReport>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklySummary = async () => {
            try {
                const response = await api.get("/sleep/tracker/weekly-summary");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch weekly summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklySummary();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                Loading weekly report...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                Failed to load weekly report.
            </div>
        );
    }

    // Generate exactly 7 days, including missing days
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (7 - i));

        // Use local date instead of toISOString()
        const dateString = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        const existing = data.daily.find(
            (item) => item.date === dateString
        );

        return {
            day: date.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            date: dateString,
            sleep_duration: existing?.sleep_duration ?? null,
            awakenings: existing?.awakenings ?? null,
            is_good_sleep: existing?.is_good_sleep ?? null,
        };
    });

    return (
        <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Sleep
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {data.summary.average_sleep.toFixed(2)}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            hrs
                        </span>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Good Sleep Days
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {data.summary.good_days}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            / 7 days
                        </span>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Awakenings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {data.summary.average_awakenings.toFixed(1)}
                    </p>
                </div>

            </div>

            {/* Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Weekly Sleep Duration
                    </h2>

                    <p className="text-sm text-gray-500">
                        Sleep duration for the last 7 days
                    </p>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                domain={[0, "auto"]}
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: "Hours",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />

                            <Tooltip
                                formatter={(value) =>
                                    value !== null
                                        ? [`${value} hrs`, "Sleep Duration"]
                                        : ["No data", "Sleep Duration"]
                                }
                            />

                            <Bar
                                dataKey="sleep_duration"
                                fill="#4f46e5"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

        </div>
    );
}