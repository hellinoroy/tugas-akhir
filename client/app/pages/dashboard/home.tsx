// TODO: CRUD buat history, buat halaman tabel buat nampilin semua history
import { useEffect, useState } from "react";
import { api } from "~/root";

import TrackerCard from "~/components/dashboard/home/tracker-card";
import WeeklyTracker from "~/components/dashboard/home/weekly-tracker";

import type { TrackerAPI, Tracker } from "~/components/dashboard/home/tracker-card";
import WeeklySummary from "~/components/dashboard/home/weekly-summary";
// import type { LastSevenDaysProps } from "~/components/dashboard/home/weekly-tracker";

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
                endDate.setDate(today.getDate() - 1); // yesterday

                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 7); // 7 days ago

                const response = await api.get("/sleep/tracker", {
                    params: {
                        start_date: startDate.toISOString().split("T")[0],
                        end_date: endDate.toISOString().split("T")[0],
                    },
                });

                if (response) {
                    setHistoryData(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };


        fetchToday();
        fetchWeekly();
    }, [])




    return (
        <div>
            <div className="">
                <TrackerCard data={ trackerData } />
                <WeeklyTracker />
                <WeeklySummary />
            </div>

        </div>
    );
}