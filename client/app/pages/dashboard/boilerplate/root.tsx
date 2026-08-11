import { api } from "~/root";
import Header from "./header";
import Sidebar from "./sidebar";

import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { UserContext } from "~/context/user-context";
import type { User } from "~/context/user-context";


export default function Boilerplate() {
    const [menuOpen, setMenuOpen] = useState(false);
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
                <Header
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />

                <div className="flex flex-col sm:flex-row min-h-0 flex-1">
                    <Sidebar
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                    />

                    <main className="min-h-0 flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </UserContext>
    )
}