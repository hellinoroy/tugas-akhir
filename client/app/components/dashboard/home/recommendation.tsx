import { useContext, useEffect, useMemo, useState } from "react";
import { api } from "~/root";
import type { Tracker, TrackerAPIProp } from "./tracker-card";
import { UserContext } from "~/context/user-context";

export default function SleepImprovementRecommendations( { data }: TrackerAPIProp  ) {
    const { age } = useContext(UserContext)!;

    const filtered = useMemo(() => {
        console.log(data);
        const map = new Map<string, Tracker>();

        for (const item of data?.items ?? []) {
            const key = item.id!.toString();
            map.set(key, item);
        }

        return [...map.values()].sort(
            (a, b) =>
                new Date(a.bedtime!).getTime() -
                new Date(b.bedtime!).getTime()
        );
    }, [data]);

    const total = filtered.filter((item) => item.id != null).length;

    // Sleep duration criteria:
    // 18–64: 7–9 hours
    // 65+:   7–8 hours
    const durationFailures = filtered.filter((item) => {
        if (item.sleepDuration == null) return false;

        if (age >= 65) {
            return (
                item.sleepDuration < 7 ||
                item.sleepDuration > 8
            );
        }

        return (
            item.sleepDuration < 7 ||
            item.sleepDuration > 9
        );
    }).length;

    // Awakenings criteria:
    // 18–64: <= 1
    // 65+:   <= 2
    const awakeningFailures = filtered.filter((item) => {
        if (item.awakenings == null) return false;

        if (age >= 65) {
            return item.awakenings > 2;
        }

        return item.awakenings > 1;
    }).length;

    // Sleep efficiency criteria:
    // >= 87.5%
    const efficiencyFailures = filtered.filter((item) => {
        if (item.sleepEfficiency == null) return false;

        return item.sleepEfficiency < 0.875;
    }).length;

    const variables = [
        {
            name: "Sleep Duration",
            failures: durationFailures,
        },
        {
            name: "Awakenings",
            failures: awakeningFailures,
        },
        {
            name: "Sleep Efficiency",
            failures: efficiencyFailures,
        },
    ];

    // console.log(variables);

    const results = variables
        .map((item) => ({
            ...item,
            percentage:
                total > 0
                    ? (item.failures / total) * 100
                    : null,
        }))
        .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    Sleep Improvement Recommendations
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Based on your sleep data from the tracked days.
                </p>
            </div>

            <div className="mt-5 space-y-4">
                {results.map((item) => {
                    const hasData = item.percentage !== null;
                    const percentage = item.percentage ?? 0;

                    let priority: string;
                    let priorityClass: string;
                    let recommendation: string;

                    if (!hasData) {
                        priority = "No Data";
                        priorityClass = "text-gray-500";

                        recommendation =
                            `There is not enough sleep data to assess your ${item.name.toLowerCase()}.`;
                    } else if (percentage === 0) {
                        priority = "Excellent";
                        priorityClass = "text-green-600";

                        recommendation =
                            `Your ${item.name.toLowerCase()} met the recommended criteria in all of your assessments. Keep maintaining your current sleep habits.`;
                    } else if (percentage < 25) {
                        priority = "Low";
                        priorityClass = "text-green-600";

                        recommendation =
                            `Your ${item.name.toLowerCase()} generally meets the recommended criteria. There were only a few occasions where improvement may be needed.`;
                    } else if (percentage < 50) {
                        priority = "Medium";
                        priorityClass = "text-yellow-600";

                        recommendation =
                            `Your ${item.name.toLowerCase()} occasionally falls outside the recommended range. Consider making small adjustments to improve consistency.`;
                    } else if (percentage < 75) {
                        priority = "High";
                        priorityClass = "text-orange-600";

                        recommendation =
                            `Your ${item.name.toLowerCase()} frequently does not meet the recommended criteria. Consider making this a priority for improving your sleep quality.`;
                    } else {
                        priority = "Very High";
                        priorityClass = "text-red-600";

                        recommendation =
                            `Your ${item.name.toLowerCase()} does not meet the recommended criteria in most of your assessments. This is the main area you should focus on improving.`;
                    }

                    return (
                        <div
                            key={item.name}
                            className="rounded-xl border border-gray-200 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {item.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        {hasData
                                            ? `${item.failures} of ${total} assessments`
                                            : "No assessments available"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">
                                        {hasData ? `${percentage.toFixed(0)}%` : "—"}
                                    </p>

                                    <p
                                        className={`text-xs font-medium ${priorityClass}`}
                                    >
                                        {priority}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                                {hasData && (
                                    <div
                                        className="h-full rounded-full bg-indigo-500 transition-all"
                                        style={{
                                            width: `${Math.min(percentage, 100)}%`,
                                        }}
                                    />
                                )}
                            </div>

                            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-justify">
                                <p className="text-sm leading-relaxed text-gray-500">
                                    {recommendation}
                                </p>
                            </div>
                        </div>  
                    );
                })}
            </div>
        </div>
    );
}