import { Outlet } from "react-router";
import { api } from "~/root";
import Header from "./header";
import Sidebar from "./sidebar";

export async function clientLoader() {
    const response = await api.get("/auth/me");
    const { name, dob, gender } = response.data;

    const parsedDob = new Date(dob);
    const now = new Date();

    let age = now.getFullYear() - parsedDob.getFullYear();

    const monthDiff = now.getMonth() - parsedDob.getMonth();
    const dayDiff = now.getDate() - parsedDob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    let genderValue = 0;

    if (gender === "male") {
        genderValue = 1;
    } else if (gender === "female") {
        genderValue = 0;
    }
  
    return { name, age, genderValue };

}

export default function Boilerplate() {
    return (
        <div className="flex h-screen flex-col">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 min-h-0 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}