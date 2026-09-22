// Konsistensi menggunakan standard deviation, taro di summary
import { useEffect, useState } from "react";
import { api } from "~/root";

import TrackerCard from "~/components/dashboard/home/tracker-card";
import LatestTracker from "~/components/dashboard/home/latest-tracker";
import SleepImprovementRecommendations from "~/components/dashboard/home/recommendation";

import type { TrackerAPI, Tracker } from "~/components/dashboard/home/tracker-card";
import WeeklySummary from "~/components/dashboard/home/weekly-summary";



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
                console.log(endDate);
                
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
        <div className="flex flex-col sm:m-10 my-2 @container items-center gap-8">
            <div className="flex flex-col items-center flex-1 @5xl:flex-row gap-8">
                <TrackerCard data={ trackerData } />
                <WeeklySummary data={ historyData } />
            </div>
            <SleepImprovementRecommendations data={ historyData } /> 
            <LatestTracker data={ historyData } desc="Last 7 Days" />
        
        </div>
    );
}