import { useEffect, useState } from "react";
import { api } from "~/root";

import TrackerCard from "~/components/dashboard/home/tracker-card";
import WeeklyTracker from "~/components/dashboard/home/weekly-tracker";

import type { TrackerCardProp } from "~/components/dashboard/home/tracker-card";
import type { LastSevenDaysProps } from "~/components/dashboard/home/weekly-tracker";

export default function DashboardHome() {

    const [trackerData, setTrackerData] = useState<TrackerCardProp>();
    const [history, setHistory] = useState<LastSevenDaysProps>();

    useEffect(() => {
        const fetchToday = async () => {
            const response = await api.get("/sleep/check-today-tracker");
            setTrackerData(response);
        }

        const fetchWeekly = async () => {
            try {
                const response = await api.get("/sleep/weekly");
                if(response) {
                    setHistory(response);
                }

            } catch (error) {
                
            }
        }


        fetchToday();
        fetchWeekly();
    }, [])




    return (
        <div>
            <div className="">
                <TrackerCard data={ trackerData?.data } />
                <WeeklyTracker data={ history?.data } />
            </div>

        </div>
    );
}