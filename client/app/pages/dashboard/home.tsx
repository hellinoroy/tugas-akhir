import { useEffect, useState } from "react";
import { api } from "~/root";
import type { TrackerCardProp } from "~/components/dashboard/home/tracker-card";
import TrackerCard from "~/components/dashboard/home/tracker-card";

export default function DashboardHome() {

    const [trackerData, setTrackerData] = useState<TrackerCardProp>();

    useEffect(() => {
        const fetchToday = async () => {
            const response = await api.get("/sleep/check-today-tracker");
            setTrackerData(response);
        }
        fetchToday();
    }, [])


    return (
        <div>
            <div className="">
                <TrackerCard data={ trackerData?.data } />
            </div>

        </div>
    );
}