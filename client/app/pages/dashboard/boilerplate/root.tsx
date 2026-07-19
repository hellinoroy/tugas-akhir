import { api } from "~/root";
import Header from "./header";
import Sidebar from "./sidebar";

import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { UserContext } from "~/context/user-context";
import type { User } from "~/context/user-context";


export default function Boilerplate() {
    const [user, setUser] = useState<User>({
        name: "",
        age: 0,
        genderValue: 0,
    });

    useEffect(() => {
        async function loadUser() {
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

            setUser({
                name,
                age,
                genderValue: gender === "male" ? 1 : 0,
            });
        }

        loadUser();
    }, []);
    
    return (
        <UserContext value={user}>
            <div className="flex h-screen flex-col">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 min-h-0 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </UserContext>
    )
}