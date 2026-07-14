import { Outlet } from "react-router";
import { api } from "~/root";
import { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Boilerplate() {
    const [user, setUser] = useState('');

    const getUser = async () => {
        try {
            const response = await api.get("/auth/me",);
            setUser(response.data.name);
            return response.data.user; 
        } catch (error) {
            return null; 
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <Header username={user} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 min-h-0 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}