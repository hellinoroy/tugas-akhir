// Konsistensi menggunakan standard deviation, taro di summary
import { useEffect, useState } from "react";
import { api } from "~/root";

import TrackerCard from "~/components/dashboard/home/tracker-card";
import WeeklyTracker from "~/components/dashboard/home/weekly-tracker";
import SleepImprovementRecommendations from "~/components/dashboard/home/recommendation";

import type { TrackerAPI, Tracker } from "~/components/dashboard/home/tracker-card";
import WeeklySummary from "~/components/dashboard/home/weekly-summary";
import SleepQualityDistribution from "~/components/dashboard/home/distribution";
// import SleepConsistency from "~/components/dashboard/home/consistency";


export default function DashboardHome() {
    const [trackerData, setTrackerData] = useState<Tracker>();
    const [historyData, setHistoryData] = useState<TrackerAPI>();

    useEffect(() => {
        const fetchToday = async () => {
            const response = await api.get("/sleep/check-today-tracker");
            setTrackerData(response.data);
        }

        const fetchWeekly = async () => {
            try {
                const today = new Date();

                const endDate = new Date(today);
                endDate.setDate(today.getDate() - 1); 

                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);

                const response = await api.get("/sleep/tracker", {
                    params: {
                        start_date: startDate.toISOString().split("T")[0],
                        end_date: endDate.toISOString().split("T")[0],
                    },
                });
                setHistoryData(response.data);
              
            } catch (error) {
                console.error(error);
            }
        };


        fetchToday();
        fetchWeekly();
    }, [])


    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <TrackerCard data={ trackerData } />
                <WeeklyTracker data={ historyData } />
            </div>

            <WeeklySummary data={ historyData } />
            {/* <SleepImprovementRecommendations /> 
            <SleepQualityDistribution /> */}
        </div>
    );
}