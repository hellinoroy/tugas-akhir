

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

function timeToHours(time: string): number {
    const [hours, minutes] = time.split("T")[1].split(":").map(Number); 
    return hours + minutes / 60;
}

function standardDeviation(values: number[]): number {
    if (values.length === 0) {
        return 0;
    }

    const mean =
        values.reduce((sum, value) => sum + value, 0) / values.length;  

    const variance =
        values.reduce(
            (sum, value) => sum + Math.pow(value - mean, 2),
            0
        ) / values.length;

    return Math.sqrt(variance);
}

export default function WeeklySummary( { data } : TrackerAPIProp ) {

    const filtered = useMemo(() => {
        const bedtimeValues: number[] = [];
        const wakeupValues: number[] = [];
        const sleepDurationValues: number[] = [];
        const awakeningsValues: number[] = [];

        const map = new Map<string, Tracker>();

        let goodSleepDays = 0;

        for (const item of data?.items ?? []) {
            const key = item.id!.toString();
            map.set(key, item);
        }

            map.forEach((item) => {
            if (item.sleepDuration != null) {
                sleepDurationValues.push(item.sleepDuration);
            }

            if (item.awakenings != null) {
                awakeningsValues.push(item.awakenings);
            }

            if (item.bedtime) {
                bedtimeValues.push(timeToHours(item.bedtime));
            }

            if (item.wakeup) {
                wakeupValues.push(timeToHours(item.wakeup));
            }

            if (item.isGoodSleep) {
                goodSleepDays += 1;
            }
        });

        const averageSleepDuration =
            sleepDurationValues.length > 0
                ? sleepDurationValues.reduce((sum, value) => sum + value, 0) /
                  sleepDurationValues.length
                : 0;

        const averageAwakenings =
            awakeningsValues.length > 0
                ? awakeningsValues.reduce((sum, value) => sum + value, 0) /
                  awakeningsValues.length
                : 0;

        const sleepDurationSD = standardDeviation(sleepDurationValues);
        const bedtimeSD = standardDeviation(bedtimeValues);
        const wakeupSD = standardDeviation(wakeupValues);
        const awakeningsSD = standardDeviation(awakeningsValues);

        return {
            averageAwakenings,
            averageSleepDuration,
            goodSleepDays,
            totalDays: sleepDurationValues.length,
            sleepDurationSD,
            bedtimeSD,
            wakeupSD,
            awakeningsSD,
            days: [...map.values()].sort(
                (a, b) =>
                    new Date(a.created_at!).getTime() -
                    new Date(b.created_at!).getTime()
            )
        }
    }, [data]);
 
    return (
        <div className="space-y-6 w-full">

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 text-center">

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm 
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Average Sleep
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.averageSleepDuration.toFixed(2)}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            h
                        </span>
                    </p>
                </div>

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Average Awakenings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.averageAwakenings.toFixed(1)}
                    </p>
                </div>

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Good Sleep Days
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.goodSleepDays}
                        <span className="ml-1 text-base font-normal text-gray-500">
                            / {filtered.totalDays} days
                        </span>
                    </p>
                </div>

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Sleep Duration Standard Deviation
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.sleepDurationSD.toFixed(2)}
                    </p>
                </div>

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Wakup Standard Deviation
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.wakeupSD.toFixed(2)}
                    </p>
                </div>

                <div className="
                    rounded-xl border border-gray-200 
                    bg-white p-5 shadow-sm
                    flex-col justify-center content-center
                ">
                    <p className="text-sm text-gray-500">
                        Bedtime Standard Deviation
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {filtered.bedtimeSD.toFixed(2)}
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
                                dataKey="bedtime"
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
                                labelFormatter={(value) => 
                                    typeof value === 'number' ? value.toFixed(2) : value
                                }
                                formatter={(value) =>
                                    value !== null && value !== undefined
                                        ? [`${Number(value).toFixed(2)} h`, "Sleep Duration"]
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