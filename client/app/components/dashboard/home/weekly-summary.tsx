

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { Tracker, TrackerAPIProp } from "./tracker-card";

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

export default function WeeklySummary( { data } : TrackerAPIProp ) {

    const filtered = useMemo(() => {
        const map = new Map<string, Tracker>();
        let awakenings = 0;
        let sleepDuration = 0;
        let goodSleepDays = 0;
        let totalDays = 0;
        for (const item of data?.items ?? []) {
            if (!item.created_at) {
                continue;
            }

            const key = item.created_at.slice(0, 10);
            const existing = map.get(key);

            if (!existing) {
                map.set(key, item);
                continue;
            }

            if (
                new Date(item.created_at).getTime() >
                new Date(existing.created_at).getTime()
            ) {
                map.set(key, item);
            }
        }

        map.forEach((item) => {
            if(item.id) {
                totalDays += 1;
            }
            if(item.awakenings != null) {
                awakenings += item.awakenings;
            }
            if(item.sleepDuration != null) {
                sleepDuration += item.sleepDuration;
            }
            if(item.isGoodSleep) {
                goodSleepDays += 1;
            }
        })

        const averageAwakenings = totalDays > 0
            ? awakenings / totalDays
            : 0;

        const averageSleepDuration = totalDays > 0
            ? sleepDuration / totalDays
            : 0;


        return {
            averageAwakenings: averageAwakenings,
            averageSleepDuration: averageSleepDuration,
            goodSleepDays: goodSleepDays,
            totalDays: totalDays,
            days: [...map.values()].sort(
                (a, b) =>
                    new Date(a.created_at!).getTime() -
                    new Date(b.created_at!).getTime()
            )
        }
    }, [data]);

    if(filtered!.days.length === 0) {
        return (
            <div className="flex w-[1200px] h-[230px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    No History Yet
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    Complete the form on the left, then click <strong>Submit</strong> to
                    generate your sleep quality prediction.
                </p>
            </div>
        );
    }

  
 
    return (
        <div className="space-y-6 w-full">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Sleep
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.averageSleepDuration.toFixed(2)}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            hrs
                        </span>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Awakenings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.averageAwakenings.toFixed(1)}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Good Sleep Days
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {filtered.goodSleepDays}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            / {filtered.totalDays} days
                        </span>
                    </p>
                </div>


            </div>

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
                            data={filtered.days}
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
                                dataKey="created_at"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.slice(0, 10)}
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
                                labelFormatter={(value) => value?.toString().slice(0, 10)}
                                formatter={(value) =>
                                    value !== null
                                        ? [`${value} hrs`, "Sleep Duration"]
                                        : ["No data", "Sleep Duration"]
                                }
                            />

                            <Bar
                                dataKey="sleepDuration"
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